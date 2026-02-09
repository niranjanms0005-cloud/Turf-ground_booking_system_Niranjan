const Booking = require('../models/Booking');
const Ground = require('../models/Ground');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  try {
    const { groundID, bookingDate, timeSlot } = req.body;

    if (!groundID || !bookingDate || !timeSlot) {
      return res.status(400).json({ message: 'Please provide groundID, bookingDate, and timeSlot' });
    }

    // Check if ground exists and is active
    const ground = await Ground.findById(groundID);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }
    if (!ground.isActive) {
      return res.status(400).json({ message: 'Ground is not active' });
    }

    // Check if time slot is available in ground's availableSlots
    if (!ground.availableSlots.includes(timeSlot)) {
      return res.status(400).json({ message: 'Time slot is not available for this ground' });
    }

    // Enforce booking limit rule:
    // A single user may book the same ground for the same time slot a maximum of 3 times (in the past).
    // - We check existing bookings for this user + groundID + timeSlot across all dates (efficient count query).
    // - If count >= 3 -> reject with clear message.
    //
    // Additionally: a slot already reserved by another user (Pending/Approved) should block booking for that exact slot/time/date.
    const bookingDateObj = new Date(bookingDate);

    // If another user already has a Pending/Approved booking for same ground/date/time, block.
    const existingOtherBooking = await Booking.findOne({
      groundID,
      bookingDate: bookingDateObj,
      timeSlot,
      status: { $in: ['Pending', 'Approved'] },
      userID: { $ne: req.user._id },
    });
    if (existingOtherBooking) {
      return res.status(400).json({ message: 'This time slot is already booked by another user' });
    }

    // Count how many times this user has booked the same ground and timeSlot (across all dates).
    const userSameSlotCount = await Booking.countDocuments({
      groundID,
      timeSlot,
      userID: req.user._id,
    });
    if (userSameSlotCount >= 3) {
      return res.status(400).json({ message: 'Booking limit exceeded: you have already booked this ground and time slot 3 times' });
    }

    // Create booking
    const booking = await Booking.create({
      userID: req.user._id,
      groundID,
      bookingDate: new Date(bookingDate),
      timeSlot,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    });

    // Populate ground and user details
    await booking.populate('groundID', 'groundName location pricePerSlot');
    await booking.populate('userID', 'name email');

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own bookings
// @route   GET /api/bookings/user
// @access  Private (User)
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userID: req.user._id })
      .populate('groundID', 'groundName location pricePerSlot')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific ground (Ground Manager)
// @route   GET /api/bookings/ground/:groundId
// @access  Private (Ground Manager)
const getGroundBookings = async (req, res) => {
  try {
    const { groundId } = req.params;

    // Check if ground exists and belongs to the manager (if manager, not admin)
    const ground = await Ground.findById(groundId);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    // If user is groundManager, check ownership
    if (req.user.role === 'groundManager' && ground.managerID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bookings for this ground' });
    }

    const bookings = await Booking.find({ groundID: groundId })
      .populate('userID', 'name email')
      .populate('groundID', 'groundName location')
      .sort({ bookingDate: 1, timeSlot: 1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userID', 'name email')
      .populate('groundID', 'groundName location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a booking
// @route   PUT /api/bookings/:id/approve
// @access  Private (Ground Manager)
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('groundID');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is ground manager of this ground
    if (req.user.role === 'groundManager') {
      if (booking.groundID.managerID.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to approve this booking' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'Approved';
    await booking.save();

    await booking.populate('userID', 'name email');
    await booking.populate('groundID', 'groundName location');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Ground Manager)
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('groundID');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is ground manager of this ground
    if (req.user.role === 'groundManager') {
      if (booking.groundID.managerID.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to reject this booking' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.status = 'Rejected';
    await booking.save();

    await booking.populate('userID', 'name email');
    await booking.populate('groundID', 'groundName location');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check slot availability for a ground and date
// @route   GET /api/bookings/availability
// @access  Public
const checkAvailability = async (req, res) => {
  try {
    const { groundId, bookingDate } = req.query;

    if (!groundId || !bookingDate) {
      return res.status(400).json({ message: 'Please provide groundId and bookingDate' });
    }

    const ground = await Ground.findById(groundId);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }

    // Get all approved/pending bookings for this date and ground
    const bookings = await Booking.find({
      groundID: groundId,
      bookingDate: new Date(bookingDate),
      status: { $in: ['Pending', 'Approved'] },
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);
    const availableSlots = ground.availableSlots.filter((slot) => !bookedSlots.includes(slot));

    res.json({
      success: true,
      data: {
        allSlots: ground.availableSlots,
        bookedSlots,
        availableSlots,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or update a review for a booking (by the booking owner)
// @route   PUT /api/bookings/:id/review
// @access  Private (User - owner of booking)
const addOrUpdateReview = async (req, res) => {
  try {
    const { text = '', rating, visible = true } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the user who made the booking can add/update the review
    if (booking.userID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    booking.review = {
      text,
      rating,
      visible,
      reviewedAt: new Date(),
    };

    await booking.save();

    // Populate for response
    await booking.populate('userID', 'name email');
    await booking.populate('groundID', 'groundName location pricePerSlot');

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getGroundBookings,
  getAllBookings,
  approveBooking,
  rejectBooking,
  checkAvailability,
  addOrUpdateReview,
};
