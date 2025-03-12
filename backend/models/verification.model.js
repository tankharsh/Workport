const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    isServiceProvider: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // OTP expires after 10 minutes (600 seconds)
    },
});

const Verification = mongoose.model('Verification', verificationSchema);

module.exports = Verification; 