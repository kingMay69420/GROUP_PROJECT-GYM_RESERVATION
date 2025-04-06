import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import basketballImage from './basketball.jpeg';
import gym1Image from './basketball.jpeg';
import gym2Image from './event.jpg';
import gym3Image from './volleyball.jpeg';

const locations = [
  { name: "TALISAY GYM", address: "PUROK MAGKONO", image: gym1Image },
  { name: "APAGAN 1 GYM", address: "NEAR BARANGAY HALL", image: gym2Image },
  { name: "AMOTAY GYM", address: "THE BACK OF BARANGAY HALL", image: gym3Image },
];

function Home() {
  const navigate = useNavigate();

  const selectLocation = (location) => {
    navigate("/reserve", { state: { location } });
  };

  return (
    <div className="home-container">
      <div className="header-container">
        <h1 className="gym-title">NASIPIT GYM RESERVATION</h1>
        <p className="gym-subtitle">Select your preferred location</p>
      </div>
      
      <div className="locations-grid">
        {locations.map((loc, index) => (
          <div 
            key={index} 
            className="location-card"
            onClick={() => selectLocation(loc)}
          >
            <div className="card-image-container">
              <img 
                src={loc.image}
                alt={loc.name} 
                className="location-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = basketballImage;
                }}
              />
              <div className="image-overlay"></div>
            </div>
            <div className="card-content">
              <h2 className="location-name">{loc.name}</h2>
              <p className="location-address">{loc.address}</p>
              <div className="select-button">Select Location</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;