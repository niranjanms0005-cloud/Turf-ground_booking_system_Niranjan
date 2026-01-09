const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema(
  {
    groundName: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    pricePerSlot: {
      type: Number,
      required: true,
      min: 0,
    },
    availableSlots: {
      type: [String],
      required: true,
      default: [],
    },
    managerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ground', groundSchema);

