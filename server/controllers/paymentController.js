const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Ground = require('../models/Ground');

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

    // Create payment
    const payment = await Payment.create({
      bookingID,
      amount: booking.groundID.pricePerSlot,
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
      .populate('bookingID')
      .populate('bookingID.groundID', 'groundName location')
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
      .populate('bookingID')
      .populate('bookingID.userID', 'name email')
      .populate('bookingID.groundID', 'groundName location')
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

// @desc    Verify a payment
// @route   PUT /api/payments/:id/verify
// @access  Private (Payment Manager)
const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('bookingID');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus !== 'Success') {
      return res.status(400).json({ message: 'Only successful payments can be verified' });
    }

    payment.verifiedBy = req.user._id;
    await payment.save();

    await payment.populate('bookingID.userID', 'name email');
    await payment.populate('bookingID.groundID', 'groundName location');
    await payment.populate('verifiedBy', 'name email');

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund a payment
// @route   PUT /api/payments/:id/refund
// @access  Private (Payment Manager)
const refundPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('bookingID');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.paymentStatus === 'Refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    // Update payment status
    payment.paymentStatus = 'Refunded';
    payment.verifiedBy = req.user._id;
    await payment.save();

    // Update booking payment status back to Unpaid
    if (payment.bookingID) {
      payment.bookingID.paymentStatus = 'Unpaid';
      await payment.bookingID.save();
    }

    await payment.populate('bookingID.userID', 'name email');
    await payment.populate('bookingID.groundID', 'groundName location');
    await payment.populate('verifiedBy', 'name email');

    res.json({
      success: true,
      data: payment,
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
};
