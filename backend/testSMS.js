require("dotenv").config();
const sendSMS = require("./utils/smsService");

const test = async () => {
  const phone = "+916353435778"; // Must be a verified number if on trial
  const message = "This is a test OTP from MedReminder";

  console.log("Using From Number:", process.env.TWILIO_PHONE_NUMBER);
  console.log("Account SID:", process.env.TWILIO_ACCOUNT_SID);

  try {
    await sendSMS(phone, message);
    console.log("✅ Test SMS sent successfully");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error(error); // Detailed error
  }
};

test();
