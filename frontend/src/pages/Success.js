import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Success.css";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ Retrieve reservation details
  const info = location.state?.reservation || {};

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
          <span className="success-emoji">🎉</span>
          <h1 className="success-title">Reservation Successful!</h1>
          <span className="success-emoji">🎉</span>
        </div>

        <p className="success-message">Your gym reservation has been confirmed.</p>

        <div className="reservation-details">
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <div>
              <p className="detail-label">Gym Location</p>
              <p className="detail-value">{info.barangay || "N/A"}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <div>
              <p className="detail-label">Date</p>
              <p className="detail-value">{info.date || "N/A"}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <div>
              <p className="detail-label">Time</p>
              <p className="detail-value">{info.timeSlot || "N/A"}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">👤</span>
            <div>
              <p className="detail-label">Reserved By</p>
              <p className="detail-value">{info.name || "N/A"}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📧</span>
            <div>
              <p className="detail-label">Email</p>
              <p className="detail-value">{info.email || "N/A"}</p>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">💰</span>
            <div>
              <p className="detail-label">Price</p>
              <p className="detail-value">₱ 120</p>
            </div>
          </div>
        </div>

        <button className="home-button" onClick={() => navigate("/")}>
          Return to Home
        </button>
      </div>
    </div>
  );
}

export default Success;
