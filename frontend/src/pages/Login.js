import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"; // Make sure to import the CSS file

function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("https://group-project-gym-backend.vercel.app/api/staff/login", form);

      alert("Login Success!");
      navigate("/dashboard", { state: { user: res.data.user } });
    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="input-group">
        <input 
          placeholder="Username" 
          onChange={(e) => setForm({ ...form, username: e.target.value })} 
        />
      </div>
      <div className="input-group">
        <input 
          placeholder="Password" 
          type="password" 
          onChange={(e) => setForm({ ...form, password: e.target.value })} 
        />
      </div>
      <button className="login-button" onClick={handleLogin}>Login</button>

      <p className="register-link">
        Don't have an account?{" "}
        <Link to="/staff/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;