const express = require('express');
const { getContactInfo } = require('../controllers/publicController');

const router = express.Router();

router.get('/contact', getContactInfo);

module.exports = router;
