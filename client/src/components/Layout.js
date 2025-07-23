// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* This main element will now correctly contain our pages */}
      <main className="container" style={{ flexGrow: 1 }}>
        {/* Outlet is a placeholder where the child route component will be rendered */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;