const express = require('express');
const {
  getAllUsers,
  updateUserRole,
  getSystemStats,
  deleteUser,
  approveUser,
  rejectUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/reject', rejectUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);

module.exports = router;
