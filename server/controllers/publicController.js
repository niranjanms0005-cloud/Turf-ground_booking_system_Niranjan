const User = require('../models/User');

const DEFAULT_ADMIN_EMAIL = process.env.CONTACT_ADMIN_EMAIL || 'admin@mail.com';

// @desc    Get admin contact info for Contact Us (public)
// @route   GET /api/public/contact
// @access  Public
const getContactInfo = async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' })
      .select('name email phone')
      .lean();

    if (!admin) {
      return res.json({
        success: true,
        data: { name: 'Admin', email: DEFAULT_ADMIN_EMAIL, phone: '' },
      });
    }

    res.json({
      success: true,
      data: {
        name: admin.name || 'Admin',
        email: admin.email || DEFAULT_ADMIN_EMAIL,
        phone: admin.phone || '',
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContactInfo };
