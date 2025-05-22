const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server is ready to take our messages");
  }
});

const sendOTP = async (email, otp) => {
  console.log(`Sending OTP for ${email}: ${otp}`);

  const mailOptions = {
    from: `"MedReminder App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification OTP",
    text: `Your OTP code is: ${otp}`,
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
      <h2 style="text-align: center; color: #2563eb;">🔐 MedReminder Verification</h2>
      <p style="font-size: 16px; color: #374151;">Hello,</p>
      <p style="font-size: 16px; color: #374151;">Use the following OTP code to complete your verification:</p>
      <div style="text-align: center; font-size: 28px; font-weight: bold; color: #2563eb; margin: 20px 0;">${otp}</div>
      <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        If you didn’t request this code, you can safely ignore this email.
      </p>
    </div>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!", info.response);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = sendOTP;
