import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Reserve.css"; // Using the same CSS file as Login

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
    price: 120,
  });

  const [availability, setAvailability] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkAvailability = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/reservations/check-availability", {
        date: formData.date,
        timeSlot: formData.timeSlot,
      });
      setAvailability(res.data.message);
    } catch (error) {
      setAvailability("❌ Time slot not available");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReserve = async () => {
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/reservations/reserve", formData);
      await axios.post("http://localhost:5000/api/otp/send-otp", {
        email: formData.email,
      });
      navigate("/otp", { 
        state: { 
          email: formData.email,
          reservation: formData
        } 
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error);
      alert("Error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="reserve-card">
        <h2 className="reserve-title">Reserve at {selectedLocation.name}</h2>
        
        <div className="input-group">
          <input 
            type="text" 
            className="form-input"
            placeholder="Full Name" 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="text" 
            className="form-input"
            placeholder="Contact Number" 
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })} 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="email" 
            className="form-input"
            placeholder="Email Address" 
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>
        
        <div className="input-group">
          <input 
            type="date" 
            className="form-input"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
          />
        </div>
        
        <div className="input-group">
          <select 
            className="form-select"
            onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
          >
            <option value="">Select Time Slot</option>
            {[8,9,10,11,12,13,14,15,16,17,18].map(hour => (
              <option key={hour} value={`${hour > 12 ? hour-12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`}>
                {`${hour > 12 ? hour-12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="price-display">
          <span>Total Price:</span>
          <span className="price-amount">₱{formData.price.toFixed(2)}</span>
        </div>
        
        <button 
          className="availability-button"
          onClick={checkAvailability}
          disabled={isLoading || !formData.date || !formData.timeSlot}
        >
          {isLoading ? "Checking..." : "Check Availability"}
        </button>
        
        {availability && (
          <div className={`availability-status ${availability.includes("❌") ? "error" : "success"}`}>
            {availability}
          </div>
        )}
        
        {availability === "Time slot available" && (
          <button 
            className="confirm-reservation-button" // Changed class name here
            onClick={handleReserve}
            disabled={isLoading || !availability}
          >
            {isLoading ? "Processing..." : "Confirm Reservation"}
          </button>
        )}
      </div>
    </div>
  );
  
}

export default Reserve;