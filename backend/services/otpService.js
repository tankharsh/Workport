const twilio = require('twilio');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const otpStore = new Map(); // Temporary OTP store (Use Redis/DB in production)

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

function formatPhoneNumber(phone) {
    const phoneNumber = parsePhoneNumberFromString(phone, 'IN'); // Default: India
    if (!phoneNumber || !phoneNumber.isValid()) throw new Error("Invalid phone number");
    return phoneNumber.formatInternational();
}

async function sendOtp(phone) {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        const otp = generateOtp();

        otpStore.set(formattedPhone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        await client.messages.create({
            body: `Your OTP is ${otp}. It expires in 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone
        });

        return { success: true, message: "OTP sent successfully", phone: formattedPhone };
    } catch (error) {
        return { success: false, message: error.message || "Failed to send OTP" };
    }
}

function verifyOtp(phone, otp) {
    try {
        const formattedPhone = formatPhoneNumber(phone);
        const storedOtp = otpStore.get(formattedPhone);

        if (!storedOtp || storedOtp.expiresAt < Date.now()) {
            return { success: false, message: "OTP expired or invalid" };
        }

        if (storedOtp.otp === otp) {
            otpStore.delete(formattedPhone);
            return { success: true, message: "OTP verified successfully" };
        }
        return { success: false, message: "Invalid OTP" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { sendOtp, verifyOtp };
