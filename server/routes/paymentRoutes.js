const express = require('express');
const {
  createPayment,
  getUserPayments,
  getAllPayments,
  verifyPayment,
  refundPayment,
  getPaymentDashboardStats,
  getGroundManagerEarnings,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', protect, createPayment);
router.get('/user', protect, getUserPayments);

// Dashboard stats route (Payment Manager/Admin)
router.get('/dashboard-stats', protect, authorize('paymentManager', 'admin'), getPaymentDashboardStats);

// Ground Manager earnings route (Ground Manager can view their own earnings)
router.get('/manager-earnings', protect, authorize('groundManager', 'admin'), getGroundManagerEarnings);

// Payment Manager routes
router.get('/', protect, authorize('paymentManager', 'admin'), getAllPayments);
router.put('/:id/verify', protect, authorize('paymentManager', 'admin'), verifyPayment);
router.put('/:id/refund', protect, authorize('paymentManager', 'admin'), refundPayment);

module.exports = router;
