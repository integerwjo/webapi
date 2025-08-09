// Layout.jsx
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footers.jsx'; // Assuming you have a Footer component

export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

// This component serves as a layout wrapper for the application, including the header and main content area