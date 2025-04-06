const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema({
  barangay: String,
  name: String,
  contactNo: String,
  email: String,
  date: String,
  timeSlot: String,
  price: Number,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Reservation", ReservationSchema);
