const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Ground = require('../models/Ground');
const User = require('../models/User');

// Revenue distribution percentages
const DISTRIBUTION = {
  GROUND_MANAGER: 0.90, // 90%
  PAYMENT_MANAGER: 0.05, // 5%
  ADMIN: 0.05, // 5%
};

// Refund percentage (user gets 80%, 20% retained)
const REFUND_PERCENTAGE = 0.80;

// Helper function for precise currency calculations (2 decimal places)
const toCurrency = (value) => Math.round(value * 100) / 100;

// @desc    Create a payment (simulated)
// @route   POST /api/payments
// @access  Private (User)
const createPayment = async (req, res) => {
  try {
    const { bookingID, paymentMethod = 'Online' } = req.body;

    if (!bookingID) {
      return res.status(400).json({ message: 'Please provide bookingID' });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingID).populate('groundID');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this booking' });
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ bookingID });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this booking' });
    }

    // Generate a simulated transaction ID
    const transactionID = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const amount = booking.amount != null && booking.amount > 0
      ? booking.amount
      : (booking.timeSlots && booking.timeSlots.length
          ? booking.timeSlots.length * booking.groundID.pricePerSlot
          : booking.groundID.pricePerSlot);

    const payment = await Payment.create({
      bookingID,
      amount,
      paymentMethod,
      transactionID,
      paymentStatus: 'Success', // Simulated - always succeeds
    });

    // Update booking payment status
    booking.paymentStatus = 'Paid';
    await booking.save();

    await payment.populate('bookingID');
    await payment.populate('bookingID.userID', 'name email');
    await payment.populate('bookingID.groundID', 'groundName location');

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's payments
// @route   GET /api/payments/user
// @access  Private (User)
const getUserPayments = async (req, res) => {
  try {
    // Get all bookings by user, then get payments for those bookings
    const userBookings = await Booking.find({ userID: req.user._id });
    const bookingIds = userBookings.map((b) => b._id);

    const payments = await Payment.find({ bookingID: { $in: bookingIds } })
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'groundID', select: 'groundName location' },
          { path: 'userID', select: 'name email' },
        ],
      })
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (Payment Manager/Admin)
// @route   GET /api/payments
// @access  Private (Payment Manager/Admin)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'userID', select: 'name email' },
          { path: 'groundID', select: 'groundName location' },
        ],
      })
      .populate('verifiedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify a payment and distribute revenue
// @route   PUT /api/payments/:id/verify
// @access  Private (Payment Manager/Admin)
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'bookingID',
      populate: [
        { path: 'userID', select: 'name email' },
        { path: 'groundID', select: 'groundName location managerID' },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Prevent verifying refunded or non-success payments
    if (payment.paymentStatus === 'Refunded') {
      return res.status(400).json({ message: 'Cannot verify a refunded payment' });
    }
    if (payment.paymentStatus !== 'Success') {
      return res.status(400).json({ message: 'Only successful payments can be verified' });
    }

    // Prevent double verification/distribution
    if (payment.verifiedBy || payment.distributed) {
      return res.status(400).json({ message: 'Payment already verified and distributed' });
    }

    // Get the ground to find the manager
    const ground = await Ground.findById(payment.bookingID.groundID._id || payment.bookingID.groundID);
    if (!ground) {
      return res.status(404).json({ message: 'Associated ground not found' });
    }

    // Calculate revenue distribution with proper precision
    const totalAmount = payment.amount;
    const groundManagerShare = toCurrency(totalAmount * DISTRIBUTION.GROUND_MANAGER);
    const paymentManagerShare = toCurrency(totalAmount * DISTRIBUTION.PAYMENT_MANAGER);
    const adminShare = toCurrency(totalAmount * DISTRIBUTION.ADMIN);

    // Find an admin user to credit (first admin found)
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(500).json({ message: 'No admin user found for revenue distribution' });
    }

    // Update wallet balances using $inc for atomic operations
    await User.findByIdAndUpdate(
      ground.managerID,
      { $inc: { wallet: groundManagerShare } }
    );

    await User.findByIdAndUpdate(
      req.user._id, // Payment manager who is verifying
      { $inc: { wallet: paymentManagerShare } }
    );

    await User.findByIdAndUpdate(
      adminUser._id,
      { $inc: { wallet: adminShare } }
    );

    // Update payment record with distribution details
    payment.verifiedBy = req.user._id;
    payment.groundManagerShare = groundManagerShare;
    payment.paymentManagerShare = paymentManagerShare;
    payment.adminShare = adminShare;
    payment.distributed = true;
    await payment.save();

    await payment.populate({
      path: 'bookingID',
      populate: [{ path: 'userID', select: 'name email' }, { path: 'groundID', select: 'groundName location' }],
    });
    await payment.populate('verifiedBy', 'name email');

    res.json({
      success: true,
      data: payment,
      distribution: {
        groundManagerShare,
        paymentManagerShare,
        adminShare,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund a payment (80% to user, 20% retained)
// @route   PUT /api/payments/:id/refund
// @access  Private (Payment Manager/Admin)
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'bookingID',
      populate: [
        { path: 'userID', select: 'name email' },
        { path: 'groundID', select: 'groundName location managerID' },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Prevent duplicate refunds
    if (payment.paymentStatus === 'Refunded') {
      return res.status(400).json({ message: 'Payment has already been refunded' });
    }

    // Only successful payments can be refunded
    if (payment.paymentStatus !== 'Success') {
      return res.status(400).json({ message: 'Only successful payments can be refunded' });
    }

    // Ensure payment was distributed before refund
    if (!payment.distributed) {
      return res.status(400).json({ message: 'Payment must be verified before it can be refunded' });
    }

    // Calculate refund amount (80% of original amount)
    const refundAmount = toCurrency(payment.amount * REFUND_PERCENTAGE);
    const retainedAmount = toCurrency(payment.amount - refundAmount);

    // Get the ground to find the manager
    const ground = await Ground.findById(payment.bookingID.groundID._id || payment.bookingID.groundID);
    if (!ground) {
      return res.status(404).json({ message: 'Associated ground not found' });
    }

    // Find the admin user (same one used during distribution)
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return res.status(500).json({ message: 'No admin user found for refund processing' });
    }

    // Deduct previously distributed amounts from wallets using $inc (negative values)
    // Using the stored share amounts ensures we deduct exactly what was credited
    await User.findByIdAndUpdate(
      ground.managerID,
      { $inc: { wallet: -payment.groundManagerShare } }
    );

    await User.findByIdAndUpdate(
      payment.verifiedBy, // The payment manager who originally verified
      { $inc: { wallet: -payment.paymentManagerShare } }
    );

    await User.findByIdAndUpdate(
      adminUser._id,
      { $inc: { wallet: -payment.adminShare } }
    );

    // Update payment status and refund details
    payment.paymentStatus = 'Refunded';
    payment.refundAmount = refundAmount;
    payment.refundedBy = req.user._id;
    payment.distributed = false; // Mark as no longer distributed
    await payment.save();

    // Update booking status to Cancelled and payment status
    if (payment.bookingID) {
      const booking = await Booking.findById(payment.bookingID._id);
      if (booking) {
        booking.status = 'Cancelled';
        booking.paymentStatus = 'Unpaid';
        await booking.save();
      }
    }

    await payment.populate({
      path: 'bookingID',
      populate: [{ path: 'userID', select: 'name email' }, { path: 'groundID', select: 'groundName location' }],
    });
    await payment.populate('verifiedBy', 'name email');
    await payment.populate('refundedBy', 'name email');

    res.json({
      success: true,
      data: payment,
      refundDetails: {
        originalAmount: payment.amount,
        refundAmount,
        retainedAmount,
        refundPercentage: REFUND_PERCENTAGE * 100,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment dashboard statistics
// @route   GET /api/payments/dashboard-stats
// @access  Private (Payment Manager/Admin)
const getPaymentDashboardStats = async (req, res) => {
  try {
    // Get all payments for calculations
    const allPayments = await Payment.find();

    // Calculate totals
    const successfulPayments = allPayments.filter(p => p.paymentStatus === 'Success' || p.paymentStatus === 'Refunded');
    const currentSuccessPayments = allPayments.filter(p => p.paymentStatus === 'Success');
    const refundedPayments = allPayments.filter(p => p.paymentStatus === 'Refunded');
    const pendingVerification = allPayments.filter(p => p.paymentStatus === 'Success' && !p.verifiedBy);

    // Total revenue (all successful payments that were ever made)
    const totalRevenue = toCurrency(successfulPayments.reduce((sum, p) => sum + p.amount, 0));

    // Total refunded amount (amount returned to users - 80%)
    const totalRefundedAmount = toCurrency(refundedPayments.reduce((sum, p) => sum + p.refundAmount, 0));

    // Total retained from refunds (20% portion)
    const totalRetainedFromRefunds = toCurrency(refundedPayments.reduce((sum, p) => sum + (p.amount - p.refundAmount), 0));

    // Distribution totals from currently distributed payments
    const distributedPayments = allPayments.filter(p => p.distributed === true);
    const totalGroundManagerShare = toCurrency(distributedPayments.reduce((sum, p) => sum + p.groundManagerShare, 0));
    const totalPaymentManagerShare = toCurrency(distributedPayments.reduce((sum, p) => sum + p.paymentManagerShare, 0));
    const totalAdminShare = toCurrency(distributedPayments.reduce((sum, p) => sum + p.adminShare, 0));

    // Platform commission (5% admin share from all verified payments)
    const allVerifiedPayments = allPayments.filter(p => p.verifiedBy);
    const totalPlatformCommission = toCurrency(allVerifiedPayments.reduce((sum, p) => sum + p.adminShare, 0));

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalRefundedAmount,
        totalRetainedFromRefunds,
        totalSuccessfulTransactions: successfulPayments.length,
        currentActivePayments: currentSuccessPayments.length,
        pendingVerificationCount: pendingVerification.length,
        refundedCount: refundedPayments.length,
        distribution: {
          totalGroundManagerShare,
          totalPaymentManagerShare,
          totalAdminShare,
          totalPlatformCommission,
        },
        percentages: {
          groundManager: DISTRIBUTION.GROUND_MANAGER * 100,
          paymentManager: DISTRIBUTION.PAYMENT_MANAGER * 100,
          admin: DISTRIBUTION.ADMIN * 100,
          refundToUser: REFUND_PERCENTAGE * 100,
          retainedOnRefund: (1 - REFUND_PERCENTAGE) * 100,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ground manager earnings and payment history
// @route   GET /api/payments/manager-earnings
// @access  Private (Ground Manager/Admin)
const getGroundManagerEarnings = async (req, res) => {
  try {
    // Get grounds managed by this user
    const managerGrounds = await Ground.find({ managerID: req.user._id });
    const groundIds = managerGrounds.map(g => g._id);

    if (groundIds.length === 0) {
      return res.json({
        success: true,
        data: {
          totalEarnings: 0,
          totalDeductions: 0,
          netEarnings: 0,
          currentWalletBalance: req.user.wallet || 0,
          paymentHistory: [],
        },
      });
    }

    // Get all bookings for manager's grounds
    const bookings = await Booking.find({ groundID: { $in: groundIds } });
    const bookingIds = bookings.map(b => b._id);

    // Get all payments for these bookings
    const payments = await Payment.find({ bookingID: { $in: bookingIds } })
      .populate({
        path: 'bookingID',
        populate: [
          { path: 'userID', select: 'name email' },
          { path: 'groundID', select: 'groundName location' },
        ],
      })
      .sort({ createdAt: -1 });

    // Calculate earnings
    const distributedPayments = payments.filter(p => p.distributed === true || p.paymentStatus === 'Refunded');
    
    // Total earnings from distributed payments (before any refunds)
    const totalEarnings = toCurrency(
      payments
        .filter(p => p.groundManagerShare > 0 || p.paymentStatus === 'Refunded')
        .reduce((sum, p) => {
          // For refunded payments, the share was already deducted, so we need to calculate original share
          if (p.paymentStatus === 'Refunded') {
            return sum + toCurrency(p.amount * DISTRIBUTION.GROUND_MANAGER);
          }
          return sum + p.groundManagerShare;
        }, 0)
    );

    // Total deductions from refunds
    const refundedPayments = payments.filter(p => p.paymentStatus === 'Refunded');
    const totalDeductions = toCurrency(
      refundedPayments.reduce((sum, p) => sum + toCurrency(p.amount * DISTRIBUTION.GROUND_MANAGER), 0)
    );

    // Net earnings
    const netEarnings = toCurrency(totalEarnings - totalDeductions);

    // Get current wallet balance
    const currentUser = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        totalEarnings,
        totalDeductions,
        netEarnings,
        currentWalletBalance: currentUser.wallet || 0,
        sharePercentage: DISTRIBUTION.GROUND_MANAGER * 100,
        paymentHistory: payments.map(p => ({
          _id: p._id,
          transactionID: p.transactionID,
          amount: p.amount,
          groundManagerShare: p.groundManagerShare || toCurrency(p.amount * DISTRIBUTION.GROUND_MANAGER),
          paymentStatus: p.paymentStatus,
          distributed: p.distributed,
          refundAmount: p.refundAmount,
          bookingDate: p.bookingID?.bookingDate,
          timeSlot: p.bookingID?.timeSlot,
          groundName: p.bookingID?.groundID?.groundName,
          userName: p.bookingID?.userID?.name,
          createdAt: p.createdAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getAllPayments,
  verifyPayment,
  refundPayment,
  getPaymentDashboardStats,
  getGroundManagerEarnings,
};
