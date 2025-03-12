const Verification = require('../models/verification.model');
const { sendVerificationEmail } = require('../utils/emailService');

// Generate a random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create or update verification record and send OTP
const createVerification = async (email, isServiceProvider = false) => {
    try {
        // Generate a new OTP
        const otp = generateOTP();
        
        // Check if a verification record already exists for this email
        const existingVerification = await Verification.findOne({ email });
        
        if (existingVerification) {
            // Update existing record with new OTP
            existingVerification.otp = otp;
            existingVerification.createdAt = Date.now();
            await existingVerification.save();
        } else {
            // Create new verification record
            await Verification.create({
                email,
                otp,
                isServiceProvider
            });
        }
        
        // Send verification email
        const emailSent = await sendVerificationEmail(email, otp, isServiceProvider);
        
        return { success: emailSent, message: emailSent ? 'Verification email sent successfully' : 'Failed to send verification email' };
    } catch (error) {
        console.error('Error creating verification:', error);
        return { success: false, message: 'Error creating verification' };
    }
};

// Verify OTP
const verifyOTP = async (email, otp) => {
    try {
        const verification = await Verification.findOne({ email });
        
        if (!verification) {
            return { success: false, message: 'No verification record found' };
        }
        
        if (verification.otp !== otp) {
            return { success: false, message: 'Invalid OTP' };
        }
        
        // OTP is valid, delete the verification record
        await Verification.deleteOne({ _id: verification._id });
        
        return { 
            success: true, 
            message: 'Email verified successfully',
            isServiceProvider: verification.isServiceProvider
        };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: 'Error verifying OTP' };
    }
};

module.exports = {
    createVerification,
    verifyOTP
}; 