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
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
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

