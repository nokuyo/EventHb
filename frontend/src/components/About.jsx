import React from 'react';

function About() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>About Us</h1>
      </header>
      <main className="content">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            EventHub is dedicated to connecting communities on college campuses by making it easy to create, discover, and attend local events.
          </p>
          <h2>Our Story</h2>
          <p>
            Founded by a dedicated team, EventHub was built out of a desire to foster community connections and make event discovery seamless.
          </p>
          <h2>Our Team</h2>
          <p>
            Our team, including Simon Meili, Zachary Felcyn, and Luis Zarate, brings together expertise in web development and community engagement.
          </p>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default About;
