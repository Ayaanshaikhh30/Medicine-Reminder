const twilio = require("twilio");
require("dotenv").config(); // Optional if already loaded elsewhere


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


/**
 * ✅ Send SMS using Twilio
 * @param {string} phone - Recipient phone number (with country code)
 * @param {string} message - SMS content
 */
const sendSMS = async (phone, message) => {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`✅ SMS sent to ${phone} (SID: ${response.sid})`);
    return true;
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
};

module.exports = sendSMS;

