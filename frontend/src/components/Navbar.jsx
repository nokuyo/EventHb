import React, { useState } from "react";
import logo from "../assets/Event-Hub.png"; // Import the logo

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu visibility

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu open/close state
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <img src={logo} alt="Event Hub Logo" className="logo" />

      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
        <div className={`bar ${isMenuOpen ? "open" : ""}`}></div>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <a href="/">Home</a>
        <a href="/events">Events</a>
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
}

export default Navbar;