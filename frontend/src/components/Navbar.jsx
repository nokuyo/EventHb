import React from "react";
import logo from "../assets/Event-Hub.png"; // Import the logo from the assets folder

function Navbar() {
  return (
    <nav className="navbar">
      {/* Replace "Event Creator" with the logo */}
      <img src={logo} alt="Event Hub Logo" className="logo" />
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/events">Events</a>
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
}

export default Navbar;