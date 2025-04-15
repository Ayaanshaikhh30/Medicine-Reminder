const nodemailer = require("nodemailer");
require("dotenv").config();

// Debugging - verify env variables are loaded
console.log("Email service starting with user:", process.env.EMAIL_USER);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // For local testing only
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

const sendOTP = async (email, otp) => {
  console.log(`Preparing to send OTP ${otp} to ${email}`);

  const mailOptions = {
    from: `"MedReminder App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP",
    text: `Your OTP code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">MedReminder Verification</h2>
        <p>Your one-time verification code is:</p>
        <div style="font-size: 24px; font-weight: bold; color: #2563eb; margin: 20px 0;">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p style="font-size: 12px; color: #6b7280;">If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info.response);
    return true;
  } catch (error) {
    console.error("Email sending failed:", {
      error: error.message,
      stack: error.stack,
      fullError: error
    });
    throw error;
  }
};

module.exports = sendOTP;