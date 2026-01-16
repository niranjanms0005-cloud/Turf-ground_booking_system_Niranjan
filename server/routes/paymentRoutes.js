const express = require('express');
const {
  createPayment,
  getUserPayments,
  getAllPayments,
  verifyPayment,
  refundPayment,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', protect, createPayment);
router.get('/user', protect, getUserPayments);

// Payment Manager routes
router.get('/', protect, authorize('paymentManager', 'admin'), getAllPayments);
router.put('/:id/verify', protect, authorize('paymentManager', 'admin'), verifyPayment);
router.put('/:id/refund', protect, authorize('paymentManager', 'admin'), refundPayment);

module.exports = router;
