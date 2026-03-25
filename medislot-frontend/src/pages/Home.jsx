import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/HomePage.css";
function Home() {
  const navigate = useNavigate();

  const handleBookClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/book"); // user logged in → booking page
    } else {
      navigate("/login"); // not logged in → login page
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Welcome to Medislot</h1>
          <p>Book appointments with certified doctors in seconds</p>
          <button className="btn-hero" onClick={handleBookClick}>
            Book Now
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Medislot?</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>Verified Doctors</h3>
            <p>All doctors are certified and verified for your safety.</p>
          </div>
          <div className="card">
            <h3>Easy Booking</h3>
            <p>Book appointments in just a few clicks anytime.</p>
          </div>
          <div className="card">
            <h3>Real-time Availability</h3>
            <p>Check doctors’ slots instantly and avoid delays.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat">
          <h3>150+</h3>
          <p>Doctors</p>
        </div>
        <div className="stat">
          <h3>1200+</h3>
          <p>Appointments Booked</p>
        </div>
        <div className="stat">
          <h3>500+</h3>
          <p>Happy Patients</p>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="doctors">
        <h2>Our Doctors</h2>
        <div className="doctor-cards">
          <div className="doctor-card">
            <div className="doctor-img">👨‍⚕️</div>
            <h4>Dr. John Smith</h4>
            <p>Cardiologist</p>
          </div>
          <div className="doctor-card">
            <div className="doctor-img">👩‍⚕️</div>
            <h4>Dr. Lisa Ray</h4>
            <p>Dermatologist</p>
          </div>
          <div className="doctor-card">
            <div className="doctor-img">👨‍⚕️</div>
            <h4>Dr. Ahmed Khan</h4>
            <p>General Physician</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Medislot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;