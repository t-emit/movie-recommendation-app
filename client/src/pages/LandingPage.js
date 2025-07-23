// src/pages/LandingPage.js
import React, { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSearch, FaHeart, FaLightbulb } from 'react-icons/fa'; // Feature icons

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // If the user is already logged in, redirect them to the dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">Discover Your Next Favorite Movie.</h1>
          <p className="hero-subtitle">
            Search, track, and get personalized recommendations all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      <section className="features-section container">
        <h2 className="section-title">How It Works</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FaSearch className="feature-icon" />
            <h3>Search</h3>
            <p>Find any movie from a vast library of titles, both old and new.</p>
          </div>
          <div className="feature-item">
            <FaHeart className="feature-icon" />
            <h3>Personalize</h3>
            <p>Create your own lists of liked, disliked, and watchlisted movies.</p>
          </div>
          <div className="feature-item">
            <FaLightbulb className="feature-icon" />
            <h3>Discover</h3>
            <p>Get smart recommendations based on your unique taste.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;