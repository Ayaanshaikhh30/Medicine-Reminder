const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/emailService");
require("dotenv").config();

// JWT Token Generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP API
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    let user = await User.findOne({ email });

    if (user && user.verified) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log("🔐 Generated OTP:", otp);
   
    console.log("📨 Using email:", process.env.EMAIL_USER);

    if (!user) {
      user = new User({ email, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    await sendOTP(email, otp);

    console.log("✅ OTP email sent to:", email);
    res.status(200).json({ message: "OTP sent successfully!" });

  } catch (error) {
    console.error("❌ Error in /send-otp:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
      details: error.response ? error.response : null,
    });
  }
});

module.exports = router;
