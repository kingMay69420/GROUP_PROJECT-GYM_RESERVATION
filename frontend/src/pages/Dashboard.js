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
      const res = await axios.get(`http://localhost:5000/api/reservations?barangay=${user.barangay}`);
      setReservations(res.data);
    } catch (error) {
      console.error("Error loading reservations", error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:5000/api/reservations/reserve", form);
      setForm({ ...form, name: "", contact: "", email: "", date: "", timeSlot: "", price: "" });
      loadReservations();
      setIsFormVisible(false);  // Hide form after adding
    } catch (error) {
      console.error("Error adding reservation", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/reservations/${editId}`, form);
      setEditId(null);
      setForm({ ...form, name: "", contact: "", email: "", date: "", timeSlot: "", price: "" });
      loadReservations();
      setIsFormVisible(false);  // Hide form after update
    } catch (error) {
      console.error("Error updating reservation", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${id}`);
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
<div className="dashboard-container">
  <div className="dashboard-header">
    <div className="header-info">
    <h2>Welcome, {user?.username}</h2>
    <p className="b">Barangay: {user?.barangay}</p>
      <div className="header-left">
        <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      </div>
    </div>
  </div>

      {/* Add button to show form */}
      <button onClick={() => setIsFormVisible(prevState => !prevState)}>
  {isFormVisible ? "Close Form" : "Add Reservation"}
</button>


      {/* Conditionally render the form */}
      {isFormVisible && (
        <div className="form-section">
          <h3>{editId ? "Edit Reservation" : "New Reservation"}</h3>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Contact" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input placeholder="Time Slot" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} />
          <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          {editId ? (
            <>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <button onClick={handleAdd}>Add</button>
          )}
        </div>
      )}

      <div className="reservation-list">
        <h3>Reservations for Barangay {user?.barangay}</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time Slot</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id}>
                <td>{res.name}</td>
                <td>{res.date}</td>
                <td>{res.timeSlot}</td>
                <td>{res.price}</td>
                <td>
                  <button onClick={() => { setEditId(res._id); setForm(res); setIsFormVisible(true); }}>Edit</button>
                  <button onClick={() => handleDelete(res._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
