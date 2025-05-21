const sendSMS = require("./utils/smsService"); // Adjust path if needed

const test = async () => {
  const phone = "+916353435778"; // Replace with your real number
  const message = "This is a test OTP from MedReminder";

  try {
    await sendSMS(phone, message);
    console.log("✅ Test SMS sent successfully");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

test();
