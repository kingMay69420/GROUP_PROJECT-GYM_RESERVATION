import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate  } from "react-router-dom";
import "./Register.css"; // Reusing the same CSS file

function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    barangay: "", 
    password: "" 
  });

  const navigate = useNavigate();
  
  const handleRegister = async () => {
    try {
        await axios.post("https://group-project-gym-backend.vercel.app/api/staff/register", form);

        alert("Registered Successfully");
        navigate("/login"); // 👈 Redirect to login after success
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
        <select
          value={form.barangay}
          onChange={(e) => setForm({ ...form, barangay: e.target.value })}
          className="form-input"
        >
          <option value="">Select Barangay</option>
          <option value="TALISAY">TALISAY</option>
          <option value="APAGAN 1">APAGAN 1</option>
          <option value="AMONTAY">AMONTAY</option>
        </select>
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