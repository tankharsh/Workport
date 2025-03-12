const express = require('express');
const router = express.Router();
const { createVerification, verifyOTP } = require('../services/verification.service');

// Route to send verification email
router.post('/send-otp', async (req, res) => {
    try {
        const { email, isServiceProvider } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        
        const result = await createVerification(email, isServiceProvider);
        
        if (result.success) {
            return res.status(200).json({ success: true, message: 'Verification email sent successfully' });
        } else {
            return res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error sending verification email:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }
        
        const result = await verifyOTP(email, otp);
        
        return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router; 