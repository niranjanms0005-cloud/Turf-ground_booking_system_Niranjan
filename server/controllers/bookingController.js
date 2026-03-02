const Booking = require('../models/Booking');
const Ground = require('../models/Ground');

// Parse slot "HH:MM-HH:MM" into { start, end } (e.g. "09:00", "10:00")
const parseSlot = (slotStr) => {
  const [start, end] = (slotStr || '').split('-').map((s) => s.trim());
  return { start, end };
};

// Get slots that overlap [fromTime, toTime]. Includes any slot that overlaps the range (e.g. 09:30–12:30 includes 09:00–10:00 and 12:00–13:00)
const getSlotsInRange = (allSlots, fromTime, toTime) => {
  if (!fromTime || !toTime || fromTime >= toTime) return [];
  const sorted = [...allSlots].sort((a, b) => parseSlot(a).start.localeCompare(parseSlot(b).start));
  return sorted.filter((slotStr) => {
    const { start, end } = parseSlot(slotStr);
    return start < toTime && fromTime < end;
  });
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  try {
    const { groundID, bookingDate, timeSlot, timeFrom, timeTo } = req.body || {};

    if (!groundID || !bookingDate) {
      return res.status(400).json({ message: 'Please provide groundID and bookingDate' });
    }

    // Check if ground exists and is active
    const ground = await Ground.findById(groundID);
    if (!ground) {
      return res.status(404).json({ message: 'Ground not found' });
    }
    if (!ground.isActive) {
      return res.status(400).json({ message: 'Ground is not active' });
    }

    const bookingDateObj = new Date(bookingDate);
    let slotsToBook = [];
    let displayTimeSlot = '';
    let totalAmount = 0;

    // Range booking: timeFrom and timeTo (takes precedence over single timeSlot)
    const fromStr = timeFrom != null ? String(timeFrom).trim() : '';
    const toStr = timeTo != null ? String(timeTo).trim() : '';
    if (fromStr !== '' && toStr !== '') {
      const from = fromStr.substring(0, 5);
      const to = toStr.substring(0, 5);
      if (from >= to) {
        return res.status(400).json({ message: 'From time must be before To time' });
      }
      slotsToBook = getSlotsInRange(ground.availableSlots, from, to);
      if (slotsToBook.length === 0) {
        return res.status(400).json({ message: 'No contiguous slots available in the selected time range. Choose a range that matches the ground\'s slot boundaries (e.g. 09:00-12:00).' });
      }
      displayTimeSlot = `${slotsToBook[0].split('-')[0]}-${slotsToBook[slotsToBook.length - 1].split('-')[1]}`;
      totalAmount = slotsToBook.length * ground.pricePerSlot;
    } else if (timeSlot) {
      if (!ground.availableSlots.includes(timeSlot)) {
        return res.status(400).json({ message: 'Time slot is not available for this ground' });
      }
      slotsToBook = [timeSlot];
      displayTimeSlot = timeSlot;
      totalAmount = ground.pricePerSlot;
    } else {
      return res.status(400).json({ message: 'Please provide either a time slot (timeSlot) or a time range (timeFrom and timeTo)' });
    }

    // Get all slots already booked on this date for this ground (any booking that overlaps)
    const existingBookings = await Booking.find({
      groundID,
      bookingDate: bookingDateObj,
      status: { $in: ['Pending', 'Approved'] },
    });
    const bookedSlots = [];
    existingBookings.forEach((b) => {
      if (b.timeSlots && b.timeSlots.length) {
        bookedSlots.push(...b.timeSlots);
      } else {
        bookedSlots.push(b.timeSlot);
      }
    });

    for (const slot of slotsToBook) {
      if (bookedSlots.includes(slot)) {
        return res.status(400).json({ message: `The slot ${slot} is already booked by another user` });
      }
      const userSameSlotCount = await Booking.countDocuments({
        groundID,
        userID: req.user._id,
        $or: [
          { timeSlot: slot },
          { timeSlots: slot },
        ],
      });
      if (userSameSlotCount >= 3) {
        return res.status(400).json({ message: `Booking limit exceeded for slot ${slot}. You have already booked this ground for this time 3 times.` });
      }
    }

    const booking = await Booking.create({
      userID: req.user._id,
      groundID,
      bookingDate: bookingDateObj,
      timeSlot: displayTimeSlot,
      timeSlots: slotsToBook,
      amount: totalAmount,
      status: 'Pending',
      paymentStatus: 'Unpaid',
    });

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

    const bookedSlots = [];
    bookings.forEach((b) => {
      if (b.timeSlots && b.timeSlots.length) {
        bookedSlots.push(...b.timeSlots);
      } else {
        bookedSlots.push(b.timeSlot);
      }
    });
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
