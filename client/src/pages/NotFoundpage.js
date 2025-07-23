// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <h1 style={{ fontSize: '6rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem' }}>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="load-more-btn" style={{ textDecoration: 'none' }}>
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;