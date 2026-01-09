const Ground = require('../models/Ground');

// @desc    Get all active grounds
// @route   GET /api/grounds
// @access  Public
const getGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ isActive: true }).populate('managerID', 'name email role');
    return res.json(grounds);
  } catch (error) {
    console.error('Get grounds error:', error);
    return res.status(500).json({ message: 'Server error while fetching grounds' });
  }
};

// @desc    Get single ground by ID
// @route   GET /api/grounds/:id
// @access  Public
const getGroundById = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id).populate('managerID', 'name email role');

    if (!ground || !ground.isActive) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    return res.json(ground);
  } catch (error) {
    console.error('Get ground by id error:', error);
    return res.status(500).json({ message: 'Server error while fetching ground' });
  }
};

// @desc    Create a new ground
// @route   POST /api/grounds
// @access  Private (Admin, Ground Manager)
const createGround = async (req, res) => {
  try {
    const { groundName, location, pricePerSlot, availableSlots, managerID } = req.body;

    if (!groundName || !location || !pricePerSlot) {
      return res.status(400).json({ message: 'Ground name, location and price per slot are required' });
    }

    // For groundManager role, force managerID to be the logged-in user
    let manager = managerID;
    if (req.user.role === 'groundManager') {
      manager = req.user._id;
    }

    const ground = await Ground.create({
      groundName,
      location,
      pricePerSlot,
      availableSlots: availableSlots || [],
      managerID: manager,
    });

    return res.status(201).json(ground);
  } catch (error) {
    console.error('Create ground error:', error);
    return res.status(500).json({ message: 'Server error while creating ground' });
  }
};

// @desc    Update ground
// @route   PUT /api/grounds/:id
// @access  Private (Admin, Ground Manager - only own grounds)
const updateGround = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    // If groundManager, ensure they own this ground
    if (req.user.role === 'groundManager' && ground.managerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this ground' });
    }

    const updates = {
      groundName: req.body.groundName ?? ground.groundName,
      location: req.body.location ?? ground.location,
      pricePerSlot: req.body.pricePerSlot ?? ground.pricePerSlot,
      availableSlots: req.body.availableSlots ?? ground.availableSlots,
      isActive: req.body.isActive ?? ground.isActive,
    };

    const updatedGround = await Ground.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    return res.json(updatedGround);
  } catch (error) {
    console.error('Update ground error:', error);
    return res.status(500).json({ message: 'Server error while updating ground' });
  }
};

// @desc    Delete ground (soft delete by setting isActive to false)
// @route   DELETE /api/grounds/:id
// @access  Private (Admin, Ground Manager - only own grounds)
const deleteGround = async (req, res) => {
  try {
    const ground = await Ground.findById(req.params.id);

    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    // If groundManager, ensure they own this ground
    if (req.user.role === 'groundManager' && ground.managerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this ground' });
    }

    ground.isActive = false;
    await ground.save();

    return res.json({ message: 'Ground deactivated successfully' });
  } catch (error) {
    console.error('Delete ground error:', error);
    return res.status(500).json({ message: 'Server error while deleting ground' });
  }
};

// @desc    Get logged-in manager's grounds
// @route   GET /api/grounds/manager/my-grounds
// @access  Private (Ground Manager)
const getMyGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find({ managerID: req.user._id });
    return res.json(grounds);
  } catch (error) {
    console.error('Get my grounds error:', error);
    return res.status(500).json({ message: 'Server error while fetching your grounds' });
  }
};

module.exports = {
  getGrounds,
  getGroundById,
  createGround,
  updateGround,
  deleteGround,
  getMyGrounds,
};


