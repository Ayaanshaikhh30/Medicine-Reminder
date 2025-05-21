const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTP = require("../utils/emailService");
require("dotenv").config();

// OTP Generator
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ✅ Send OTP API
router.post("/send-otp", async (req, res) => {
  console.log("📥 /send-otp API hit");
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    let user = await User.findOne({ email });

    if (user && user.verified) {
      return res.status(400).json({ message: "User already exists. Please login." });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry for testing


    

    if (!user) {
      user = new User({ email, otp, otpExpiry });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
    }

    await user.save();

    await sendOTP(email, otp); // Send OTP via email

    console.log(`✅ OTP email sent to: ${email}`);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("❌ Error in /send-otp:", error);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

  //verify OTP API 
router.post('/verify-otp', async (req, res) => {
  console.log('Verify OTP request body:', req.body);
  const { email, otp, name, password } = req.body;

  if (!email || !otp || !name || !password) {
    console.log('Missing fields:', { email, otp, name, password });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp.toString()) {
      console.log(`OTP mismatch. DB: ${user.otp} vs Sent: ${otp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

// Hash the password and save user details
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.name = name;
    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'User verified and registered', token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return res.status(400).json({ message: "User not found or not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
