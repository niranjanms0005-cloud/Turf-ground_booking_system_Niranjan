const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      // Validation: exactly 10 digits
      validate: {
        validator: function(v) {
          // Remove non-digits and check length
          const digitsOnly = v.replace(/\D/g, '');
          return digitsOnly.length === 10;
        },
        message: 'Phone number must be exactly 10 digits',
      },
    },
    password: {
      type: String,
      required: true,
      // Password requirements enforced in controller validation
      // Minimum 8 characters with uppercase, lowercase, and number
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'groundManager', 'paymentManager'],
      default: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

