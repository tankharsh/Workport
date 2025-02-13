const otpService = require('../services/otpService');

exports.generateOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: "Phone number is required" });

        const response = await otpService.sendOtp(phone);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyOtp = (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) return res.status(400).json({ success: false, message: "Phone and OTP are required" });

        const result = otpService.verifyOtp(phone, otp);
        if (result.success) res.status(200).json(result);
        else res.status(400).json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
