const express = require('express');
const {
  getGrounds,
  getGroundById,
  createGround,
  updateGround,
  deleteGround,
  getMyGrounds,
} = require('../controllers/groundController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getGrounds);
router.get('/:id', getGroundById);

// Ground manager specific
router.get('/manager/my-grounds', protect, authorize('groundManager'), getMyGrounds);

// Admin + Ground Manager (create/update/delete)
router.post('/', protect, authorize('admin', 'groundManager'), createGround);
router.put('/:id', protect, authorize('admin', 'groundManager'), updateGround);
router.delete('/:id', protect, authorize('admin', 'groundManager'), deleteGround);

module.exports = router;


