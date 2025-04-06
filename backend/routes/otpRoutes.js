const express = require("express");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const Otp = require("../models/OTP");
const router = express.Router();

require("dotenv").config();
console.log("Loaded EMAIL_USER:", process.env.EMAIL_USER);
console.log("Loaded EMAIL_PASS:", process.env.EMAIL_PASS ? "Yes" : "No");


// Email Config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    
    const otpCode = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 minutes

    console.log(`Generated OTP for ${email}: ${otpCode}`); // Debugging

    // 🛠 Delete old OTPs for the email (if any exist)
    await Otp.deleteMany({ email });

    // 🛠 Ensure OTP is stored in MongoDB
    const newOtp = new Otp({ email, otpCode, expiresAt });
    await newOtp.save();

    console.log("OTP saved in DB:", newOtp); // Debugging

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otpCode}. It expires in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "OTP sending failed", error });
  }
});


// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find OTP for the given email
    const otpRecord = await Otp.findOne({ email, otpCode: otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiration time
    if (new Date() > new Date(otpRecord.expiresAt)) {
      await Otp.deleteOne({ _id: otpRecord._id }); // Remove expired OTP
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is valid
    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed", error });
  }
});



module.exports = router;
