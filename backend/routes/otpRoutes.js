const express = require('express');
const { generateOtp, verifyOtp } = require('../controllers/otpController');

const router = express.Router();

router.post('/send-otp', generateOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
