import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Register.css"; // Reusing the same CSS file

function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    barangay: "", 
    password: "" 
  });

  const handleRegister = async () => {
    try {
        await axios.post("http://localhost:5000/api/staff/register", form);

      alert("Registered Successfully");
    } catch (err) {
      alert("Registration Failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Create Account</h2>
      
      <div className="input-group">
        <input 
          placeholder="Username" 
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="form-input"
        />
      </div>
      
      <div className="input-group">
        <input 
          placeholder="Barangay" 
          onChange={(e) => setForm({ ...form, barangay: e.target.value })}
          className="form-input"
        />
      </div>
      
      <div className="input-group">
        <input 
          placeholder="Password" 
          type="password" 
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="form-input"
        />
      </div>
      
      <button className="login-button" onClick={handleRegister}>
        Register
      </button>

      <p className="register-link">
        Already have an account?{" "}
        <Link to="/staff/login">Login here</Link>
      </p>
    </div>
  );
}

export default Register;