import React from "react";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Event Creator</h1>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/events">Events</a>
        <a href="/profile">Profile</a>
      </div>
    </nav>
  );
}

export default Navbar;
