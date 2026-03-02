const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groundID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ground',
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    // When booking by time range: array of slot strings (e.g. ['09:00-10:00','10:00-11:00'])
    timeSlots: {
      type: [String],
      default: undefined,
    },
    // Total amount for this booking (slotCount * pricePerSlot when timeSlots used)
    amount: {
      type: Number,
      min: 0,
      default: undefined,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    // Optional review submitted by the user after the booking
    review: {
      text: { type: String, trim: true, default: '' },
      rating: { type: Number, min: 1, max: 5, default: null },
      visible: { type: Boolean, default: true }, // visible to other users/admin
      reviewedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

