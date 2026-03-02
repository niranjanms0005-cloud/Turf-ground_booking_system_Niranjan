const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bookingID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Online',
    },
    transactionID: {
      type: String,
      required: true,
      unique: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Success', 'Failed', 'Refunded'],
      default: 'Success',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Revenue distribution tracking
    groundManagerShare: {
      type: Number,
      default: 0,
    },
    paymentManagerShare: {
      type: Number,
      default: 0,
    },
    adminShare: {
      type: Number,
      default: 0,
    },
    distributed: {
      type: Boolean,
      default: false,
    },
    // Refund tracking
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

