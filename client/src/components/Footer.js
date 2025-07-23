// src/components/Footer.js
import React, { useState } from 'react'; // <-- Import useState
import { Link } from 'react-router-dom';
import { FaEnvelope } from 'react-icons/fa'; // A different envelope icon

import ContactModal from './ContactModal'; // <-- Import the new modal component

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-container container">
          <div className="footer-section footer-about">
            
            <p>
              CineRec is your personal movie universe. Discover, track, and get recommendations for movies you'll love.
            </p>
          </div>

          <div className="footer-section footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          <div className="footer-section footer-contact">
            <h4>Get In Touch</h4>
            {/* THIS IS THE NEW CONTACT BUTTON */}
            <button onClick={openModal} className="contact-button">
              <FaEnvelope /> Contact the Owner
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CineRec. All Rights Reserved.</p>
        </div>
      </footer>

      {/* RENDER THE MODAL COMPONENT */}
      <ContactModal isOpen={isModalOpen} onRequestClose={closeModal} />
    </>
  );
};

export default Footer;