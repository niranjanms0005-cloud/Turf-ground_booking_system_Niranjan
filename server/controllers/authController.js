const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * Sanitize input by removing potentially dangerous characters
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  // Remove any HTML tags and trim whitespace
  return input.trim().replace(/<[^>]*>/g, '');
};

/**
 * Validate email format - must contain @ and valid domain (e.g., gmail.com, mail.com)
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
const validateEmailFormat = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }

  // Trim and convert to lowercase for consistency
  const trimmedEmail = email.trim().toLowerCase();

  // Check for @ symbol
  if (!trimmedEmail.includes('@')) {
    return { isValid: false, message: 'Email must contain @ symbol' };
  }

  // Validate email format with regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Email must be in a valid format (e.g., user@example.com)' };
  }

  // Check for proper domain (at least one dot after @)
  const domainRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  if (!domainRegex.test(trimmedEmail)) {
    return { isValid: false, message: 'Email must have a valid domain (e.g., gmail.com, mail.com)' };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate phone number - must be exactly 10 digits
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove any non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // Check if exactly 10 digits
  if (digitsOnly.length !== 10) {
    return { isValid: false, message: 'Phone number must be exactly 10 digits' };
  }

  // Check if all characters are digits (extra safety check)
  if (!/^\d{10}$/.test(digitsOnly)) {
    return { isValid: false, message: 'Phone number must contain only digits' };
  }

  return { isValid: true, message: '', sanitized: digitsOnly };
};

/**
 * Validate password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
const validatePasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  // Minimum 8 characters
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true, message: '' };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// @validation Complete validation including email format, phone number (10 digits), 
//             password strength (8+ chars, uppercase, lowercase, number), and duplicate email check
const registerUser = async (req, res) => {
  try {
    // Extract and sanitize inputs (preserve input except passwords)
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: 'Name, email, phone, and password are required' 
      });
    }

    // Validate confirm password (frontend sends this, backend revalidates)
    if (!confirmPassword) {
      return res.status(400).json({ 
        message: 'Please confirm your password' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: 'Passwords do not match' 
      });
    }

    // Sanitize inputs (trim whitespace, remove HTML tags)
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.trim().toLowerCase();

    // Validate name
    if (!sanitizedName || sanitizedName.length < 2) {
      return res.status(400).json({ 
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Validate email format (must have @ and valid domain like gmail.com, mail.com)
    const emailValidation = validateEmailFormat(sanitizedEmail);
    if (!emailValidation.isValid) {
      return res.status(400).json({ message: emailValidation.message });
    }

    // Validate phone number (exactly 10 digits, only digits)
    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return res.status(400).json({ message: phoneValidation.message });
    }
    const sanitizedPhone = phoneValidation.sanitized; // Use sanitized version (digits only)

    // Validate password strength (8+ chars, uppercase, lowercase, number)
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // Check for duplicate email (prevent duplicate registrations)
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Securely hash password using bcrypt with salt rounds
    // This ensures passwords are never stored in plain text
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with sanitized and validated data
    // Note: Minimal database changes - only adding phone field to existing schema
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      password: hashedPassword,
      // Allow role override for demo purposes (e.g., admin, groundManager, paymentManager)
      role: role || 'user',
    });

    // Return user data (excluding password for security)
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle duplicate email error (MongoDB unique constraint)
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Handle validation errors from mongoose schema
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0];
      return res.status(400).json({ 
        message: firstError.message || 'Validation error' 
      });
    }

    return res.status(500).json({ 
      message: 'Server error while registering user' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error while logging in' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set in auth middleware
  return res.json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
