require("dotenv").config();
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSms = async (phone, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log("Message sent:", response.sid);
    return { success: true, sid: response.sid };
  } catch (error) {
    console.error("SMS Error:", error.message);
    return { success: false, message: error.message };
  }
};

module.exports = sendSms;
