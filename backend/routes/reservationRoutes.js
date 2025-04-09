const express = require("express");
const Reservation = require("../models/Reservation");
const router = express.Router();

// POST /api/reservations/reserve - Create a reservation
router.post("/reserve", async (req, res) => {
  try {
    const { barangay, name, contact, email, date, timeSlot, price } = req.body;

    if (!barangay || !name || !contact || !email || !date || !timeSlot || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newReservation = new Reservation({
      barangay,
      name,
      contact,
      email,
      date,
      timeSlot,
      price,
    });

    await newReservation.save();
    console.log("New reservation saved:", newReservation);
    res.status(201).json({ message: "Reservation created successfully", reservation: newReservation });
  } catch (error) {
    console.error("POST /api/reservations/reserve error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// GET reservations by barangay
router.get("/", async (req, res) => {
  try {
    console.log("GET /api/reservations query:", req.query);
    const { barangay } = req.query;
    
    if (!barangay) {
      console.warn("No barangay parameter provided");
      return res.status(400).json({ message: "Barangay parameter is required" });
    }

    const reservations = await Reservation.find({
      barangay: { $regex: new RegExp(`^${barangay}$`, 'i') }  // Case-insensitive match
    });

    console.log(`Found ${reservations.length} reservations for barangay ${barangay}`);
    
    res.json(reservations);
  } catch (error) {
    console.error("GET /api/reservations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Check Availability
router.post("/check-availability", async (req, res) => {
  try {
    console.log("POST /api/reservations/check-availability body:", req.body);
    const { date, timeSlot } = req.body;
    
    if (!date || !timeSlot) {
      console.warn("Missing date or timeSlot parameters");
      return res.status(400).json({ message: "Date and timeSlot are required" });
    }

    const reservation = await Reservation.findOne({ date, timeSlot });
    console.log(`Availability check for ${date} ${timeSlot}: ${reservation ? "Not Available" : "Available"}`);

    if (reservation) {
      res.json({ available: false, message: "Time slot not available" });
    } else {
      res.json({ available: true, message: "Time slot available" });
    }
  } catch (error) {
    console.error("POST /api/reservations/check-availability error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// PUT update reservation (only date, timeSlot, and price)
router.put("/:id", async (req, res) => {
  try {
    console.log(`PUT /api/reservations/${req.params.id} body:`, req.body);
    const { id } = req.params;
    const { date, timeSlot, price } = req.body;

    // Check if all required fields are provided
    if (!date || !timeSlot || !price) {
      console.warn("Missing required parameters for update");
      return res.status(400).json({ message: "Date, timeSlot, and price are required for update" });
    }

    // Find and update the reservation (only update date, timeSlot, and price)
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { date, timeSlot, price },
      { new: true }
    );

    // If no reservation is found, send a 404 error
    if (!updatedReservation) {
      console.warn(`No reservation found with id ${id}`);
      return res.status(404).json({ message: "Reservation not found" });
    }

    console.log(`Successfully updated reservation ${id}`);
    res.json({ message: "Reservation updated successfully", reservation: updatedReservation });
  } catch (err) {
    console.error(`PUT /api/reservations/${req.params.id} error:`, err);
    res.status(500).json({ message: "Error updating reservation", error: err.message });
  }
});

// DELETE a reservation
router.delete("/:id", async (req, res) => {
  try {
    console.log(`DELETE /api/reservations/${req.params.id}`);
    const { id } = req.params;

    if (!id) {
      console.warn("No reservation ID provided");
      return res.status(400).json({ message: "Reservation ID is required" });
    }

    const deletedReservation = await Reservation.findByIdAndDelete(id);
    
    if (!deletedReservation) {
      console.warn(`No reservation found with id ${id}`);
      return res.status(404).json({ message: "Reservation not found" });
    }

    console.log(`Successfully deleted reservation ${id}`);
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    console.error(`DELETE /api/reservations/${req.params.id} error:`, err);
    res.status(500).json({ message: "Error deleting reservation", error: err.message });
  }
});


module.exports = router;

