const sendOTP = require("./utils/emailService"); // adjust if path is different

(async () => {
  try {
    const email = "ayaanshaikhh30@gmail.com"; // test with your own email
    const otp = "123456"; // hardcoded for testing
    await sendOTP(email, otp);
    console.log("✅ Email function executed");
  } catch (err) {
    console.error("❌ Test failed:", err.message);
  }
})();
