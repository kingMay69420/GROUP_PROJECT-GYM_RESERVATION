import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Optional styling

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [reservations, setReservations] = useState([]);
  const [form, setForm] = useState({
    barangay: user?.barangay || "",
    name: "",
    contact: "",
    email: "",
    date: "",
    timeSlot: "",
    price: "",
  });

  const [editId, setEditId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);  // Add state to control form visibility

  const loadReservations = async () => {
    try {
      const res = await axios.get(`https://group-project-gym-backend.vercel.app/api/reservations?barangay=${user.barangay}`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error loading reservations", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("https://group-project-gym-backend.vercel.app/api/reservations/reserve", form);
      setForm({ ...form, name: "", contact: "", email: "", date: "", timeSlot: "", price: "" });
      loadReservations();
      setIsFormVisible(false);  // Hide form after adding
    } catch (error) {
      console.error("Error adding reservation", error);
    }
  };

  const handleUpdate = async () => {
    try {
      // Make the PUT request to update the reservation
      const response = await axios.put(`https://group-project-gym-backend.vercel.app/api/reservations/${editId}`, form);
      
      // Log success message from the response
      console.log(response.data.message);  // Optional: log the success message from the backend
  
      // Reset the form and editId after the update
      setEditId(null);
      setForm({ ...form, date: "", timeSlot: "", price: "" });
  
      // Reload reservations to reflect the update
      loadReservations();
  
      // Hide the form after the update is successful
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error updating reservation", error);
      // Optionally, show an error message to the user
    }
  };
  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`https://group-project-gym-backend.vercel.app/api/reservations/${id}`);
        loadReservations();
      } catch (error) {
        console.error("Error deleting reservation", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    if (user?.barangay) {
      loadReservations();
    }
  }, [user]);

  return (
    <>
      {/* Separated Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Welcome, {user?.username}</h2>
          <p className="b">Barangay: {user?.barangay}</p>
        </div>
        <div className="header-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
  
      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* Toggle Form Button */}
        <button 
          className="toggle-form-button"
          onClick={() => setIsFormVisible(prev => !prev)}
        >
          {isFormVisible ? "Close Form" : "Add Reservation"}
        </button>
  
        {/* Conditionally Rendered Form */}
        {isFormVisible && (
          <div className={`form-section ${isFormVisible ? 'show' : 'hide'}`}>
            <h3>{editId ? "Edit Reservation" : "New Reservation"}</h3>
            <input 
                placeholder="Name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
              />
              <input 
                placeholder="Email" 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
              />
              <input 
                placeholder="Contact Number" 
                value={form.contact} 
                onChange={(e) => setForm({ ...form, contact: e.target.value })} 
              />

              <input 
                type="date" 
                value={form.date} 
                onChange={(e) => setForm({ ...form, date: e.target.value })} 
              />
              <input 
                placeholder="Time Slot" 
                value={form.timeSlot} 
                onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} 
              />
              <input 
                placeholder="Price" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
              />
            <div className="form-buttons">
              {editId ? (
                <>
                  <button onClick={handleUpdate}>Update</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <button onClick={handleAdd}>Add</button>
              )}
            </div>
          </div>
        )}
  
        <div className="reservation-list">
          <h3>Reservations for Barangay {user?.barangay}</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res._id}>
                    <td data-label="Name">{res.name}</td>
                    <td data-label="Email">{res.email}</td>
                    <td data-label="Date">{res.date}</td>
                    <td data-label="Time">{res.timeSlot}</td>
                    <td data-label="Price">{res.price}</td>
                    <td data-label="Actions" className="actions-cell">
                      <button onClick={() => { setEditId(res._id); setForm(res); setIsFormVisible(true); }}>Edit</button>
                      <button onClick={() => handleDelete(res._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
  
}

export default Dashboard;
