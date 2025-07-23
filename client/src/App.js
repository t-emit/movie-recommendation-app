// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- Import Footer
import LandingPage from './pages/LandingPage'; // <-- Import LandingPage
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import MovieDetailPage from './pages/MovieDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundpage';

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> */}
          <Navbar />
          {/* Use flex-grow to make the main content take up available space */}
          {/* <main className="container" style={{ flexGrow: 1 }}> */}
            <Routes>
              {/* UPDATED ROUTES */}
              <Route path="/" element={<LandingPage />} />
               <Route element={<Layout />}>
              <Route path="/dashboard" element={<HomePage />} /> 
              
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
           {/* <-- Add Footer here */}
        
      </AuthProvider>
    </Router>
  );
}

export default App;