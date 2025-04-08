import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Reserve from "./pages/Reserve";
import OTP from "./pages/OTP";
import Success from "./pages/Success";

// Staff System Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/success" element={<Success />} />

        {/* Staff Pages */}
        <Route path="/staff/login" element={<Login />} />
        <Route path="/staff/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
