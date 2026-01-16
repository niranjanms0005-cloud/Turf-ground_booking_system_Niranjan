const User = require('../models/User');
const Ground = require('../models/Ground');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;

    if (!role) {
      return res.status(400).json({ message: 'Please provide a role' });
    }

    const validRoles = ['user', 'admin', 'groundManager', 'paymentManager'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Prevent changing own role (optional safety check)
    if (id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role from admin' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getSystemStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalGrounds,
      totalBookings,
      totalPayments,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      paidBookings,
      unpaidBookings,
      verifiedPayments,
      refundedPayments,
    ] = await Promise.all([
      User.countDocuments(),
      Ground.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Payment.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Approved' }),
      Booking.countDocuments({ status: 'Rejected' }),
      Booking.countDocuments({ paymentStatus: 'Paid' }),
      Booking.countDocuments({ paymentStatus: 'Unpaid' }),
      Payment.countDocuments({ paymentStatus: 'Success', verifiedBy: { $ne: null } }),
      Payment.countDocuments({ paymentStatus: 'Refunded' }),
    ]);

    // Count users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    const roleCounts = {
      user: 0,
      admin: 0,
      groundManager: 0,
      paymentManager: 0,
    };

    usersByRole.forEach((item) => {
      roleCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          byRole: roleCounts,
        },
        grounds: {
          total: totalGrounds,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          rejected: rejectedBookings,
          paid: paidBookings,
          unpaid: unpaidBookings,
        },
        payments: {
          total: totalPayments,
          verified: verifiedPayments,
          refunded: refundedPayments,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (optional - for admin control)
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting own account
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  getSystemStats,
  deleteUser,
};
