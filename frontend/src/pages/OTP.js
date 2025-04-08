import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";

function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

// In OTP.js, modify the verifyOTP function:
const verifyOTP = async () => {
  try {
    await axios.post("http://localhost:5000/api/otp/verify-otp", { email, otp });
    
    // Navigate to Success Page with reservation details from location.state
    navigate("/success", { 
      state: { 
        reservation: location.state.reservation 
      } 
    });
  
  } catch (error) {
    alert("Invalid or expired OTP");
  }
};
  

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/api/otp/send-otp", { email });
      setTimeLeft(300); // Reset timer to 5 minutes
      setIsResendDisabled(true); // Disable resend button again
      alert("OTP has been resent to your email");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h1 className="otp-title">Enter Verification Code</h1>
        <p className="otp-subtitle">We've sent a 6-digit code to <span className="email-highlight">{email}</span></p>
        
        <div className="otp-input-group">
          <input 
            type="text" 
            className="otp-input"
            placeholder="Enter code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </div>
        
        <button 
          className="verify-button"
          onClick={verifyOTP}
          disabled={!otp || otp.length < 6}
        >
          Verify
        </button>
        
        <div className="timer-resend-group">
          <div className="timer">
            <svg className="timer-icon" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
              <path d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
            </svg>
            <span>Code expires in: {formatTime(timeLeft)}</span>
          </div>
          <button 
            className={`resend-button ${isResendDisabled ? 'disabled' : ''}`}
            onClick={resendOTP} 
            disabled={isResendDisabled}
          >
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
}

export default OTP;