const express = require("express");
const router = express.Router();
const { getStaffConnection } = require("../config/db");
const staffUserSchema = require("../models/staffUserModel").schema;

const StaffUser = getStaffConnection().model("StaffUser", staffUserSchema);

// Register
router.post("/register", async (req, res) => {
  const { username, barangay, password } = req.body;
  try {
    const newUser = new StaffUser({ username, barangay, password });
    await newUser.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await StaffUser.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;

