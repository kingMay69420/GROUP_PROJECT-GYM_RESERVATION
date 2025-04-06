const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: String,
  otpCode: String,
  expiresAt: Date,
});

module.exports = mongoose.model("Otp", OtpSchema);
