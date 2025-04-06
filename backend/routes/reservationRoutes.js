const express = require("express");
const Reservation = require("../models/Reservation");
const router = express.Router();

// Create Reservation
router.post("/reserve", async (req, res) => {
  try {
    const { barangay, name, contactNo, email, date, timeSlot, price } = req.body;

    // Check if slot is available
    const existingReservation = await Reservation.findOne({ date, timeSlot });
    if (existingReservation) {
      return res.status(400).json({ message: "Time slot not available" });
    }

    // Save to DB
    const reservation = new Reservation({ barangay, name, contactNo, email, date, timeSlot, price });
    await reservation.save();

    res.status(201).json({ message: "Reservation pending OTP verification", reservation });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Check Availability
router.post("/check-availability", async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const reservation = await Reservation.findOne({ date, timeSlot });

    if (reservation) {
      res.json({ available: false, message: "Time slot not available" });
    } else {
      res.json({ available: true, message: "Time slot available" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

