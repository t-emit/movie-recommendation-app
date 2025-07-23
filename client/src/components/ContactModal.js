// src/components/ContactModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

// Style for the modal (unchanged)
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#202020',
    border: '1px solid #444',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
  },
};

Modal.setAppElement('#root');

const ContactModal = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  // NEW: State to handle submission status (idle, sending, success, error)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // UPDATED: handleSubmit function to use web3forms
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('Sending...');

    const dataToSend = {
      ...formData,
      // This is the required field for web3forms
      access_key: process.env.REACT_APP_WEB3FORMS_ACCESS_KEY,
      subject: `New Contact Form Submission from ${formData.name}`,
    };

// ADD THIS LINE FOR DEBUGGING
console.log("Access Key being sent to API:", process.env.WEB3FORM_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('Thank you! Your message has been sent.');
        setFormData({ name: '', email: '', message: '' }); // Clear form
        // Optional: close modal after a short delay
        setTimeout(() => {
          onRequestClose();
          setStatus('');
        }, 3000);
      } else {
        console.error("Submission Error:", result);
        setStatus(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setStatus("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // A helper function to close the modal and reset state
  const handleClose = () => {
    // Reset status and form data when closing the modal manually
    setStatus('');
    setFormData({ name: '', email: '', message: '' });
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose} // Use the new handler
      style={customStyles}
      contentLabel="Contact Form"
    >
      <div className="contact-modal-header">
        <h2>Contact Me</h2>
        <button onClick={handleClose} className="close-modal-btn">
          <FaTimes />
        </button>
      </div>
      <div className="contact-modal-body">
        {/* We show the status message if it exists, otherwise the form */}
        {status && !isSubmitting ? (
          <p className={status.includes('Thank you') ? "success-message" : "error-message"}>{status}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="5" required value={formData.message} onChange={handleChange}></textarea>
            </div>
            <button type="submit" className="auth-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {/* Show status during submission */}
            {isSubmitting && <p className="sending-message">{status}</p>}
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ContactModal;