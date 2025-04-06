require("dotenv").config();
console.log("Email User:", process.env.EMAIL_USER);
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import MongoDB connection function
const reservationRoutes = require("./routes/reservationRoutes");
const otpRoutes = require("./routes/otpRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/otp", otpRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Reservation System API is running...");
});

// Handle Unhandled Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
