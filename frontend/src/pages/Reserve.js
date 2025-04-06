import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Reserve.css";

function Reserve() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = location.state?.location || {};
  const [formData, setFormData] = useState({
    barangay: selectedLocation.name,
    name: "",
    contact: "",
    email: "",
    date: "",
    timeSlot: "",
    price: 500, // Default price
  });

  const [availability, setAvailability] = useState(null);

  const checkAvailability = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/reservations/check-availability", {
        date: formData.date,
        timeSlot: formData.timeSlot,
      });
      setAvailability(res.data.message);
    } catch (error) {
      setAvailability("❌ Time slot not available");
    }
  };

  const handleReserve = async () => {
    try {
      // 1. Reserve first
      const reservationResponse = await axios.post(
        "http://localhost:5000/api/reservations/reserve",
        formData
      );
  
      console.log("Reservation Success:", reservationResponse.data);
  
      // 2. Send OTP
      const otpResponse = await axios.post("http://localhost:5000/api/otp/send-otp", {
        email: formData.email,
      });
  
      console.log("OTP Sent:", otpResponse.data);
  
      // 3. Navigate to OTP Page only if everything is successful
      navigate("/otp", { state: { email: formData.email } });
      
    } catch (error) {
      console.error("Error making reservation:", error.response ? error.response.data : error);
      alert("Error making reservation. Please try again.");
    }
  };
  return (
    <div className="reservation-container">
      <h1>{selectedLocation.name}</h1>
      <input type="text" placeholder="Name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
      <input type="text" placeholder="Contact No." onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
      <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
      <input type="date" onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      <select onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}>
        <option value="">Select Time Slot</option>
        <option value="8:00 AM">8:00 AM</option>
        <option value="9:00 AM">9:00 AM</option>
        <option value="10:00 AM">10:00 AM</option>
        <option value="11:00 AM">11:00 AM</option>
        <option value="12:00 PM">12:00 PM</option>
        <option value="1:00 PM">1:00 PM</option>
        <option value="2:00 PM">2:00 PM</option>
        <option value="3:00 PM">3:00 PM</option>
        <option value="4:00 PM">4:00 PM</option>
        <option value="5:00 PM">5:00 PM</option>
        <option value="6:00 PM">6:00 PM</option>
      </select>
      <button onClick={checkAvailability}>Check Availability</button>
      {availability && <p>{availability}</p>}
      {availability === "Time slot available" && <button onClick={handleReserve}>Reserve</button>}
    </div>
  );
}

export default Reserve;

