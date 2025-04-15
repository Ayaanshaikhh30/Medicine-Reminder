const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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


    const sendSMS = require('./path/to/your/sendSMSFile');

const testPhoneNumber = '+918123456789'; // Replace with your phone number
const testMessage = 'This is a test message from Twilio!';

sendSMS(testPhoneNumber, testMessage);


    console.log(`✅ SMS sent to ${phone} (SID: ${response.sid})`);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
};

module.exports = sendSMS;
