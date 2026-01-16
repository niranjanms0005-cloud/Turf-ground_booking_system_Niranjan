const express = require('express');
const {
  createBooking,
  getUserBookings,
  getGroundBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  checkAvailability,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route
router.get('/availability', checkAvailability);

// User routes
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);

// Ground Manager routes
router.get('/ground/:groundId', protect, authorize('groundManager', 'admin'), getGroundBookings);
router.put('/:id/approve', protect, authorize('groundManager', 'admin'), approveBooking);
router.put('/:id/reject', protect, authorize('groundManager', 'admin'), rejectBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

module.exports = router;
