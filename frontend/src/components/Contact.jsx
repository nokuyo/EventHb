import React from 'react';

function Contact() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Contact Us</h1>
      </header>
      <main className="content">
        <div className="container">
          <h2>Get in Touch</h2>
          <p>
            Have questions or need support? Please fill out the form below, and our team will get back to you as soon as possible.
          </p>
          <form action="/contact" method="POST">
            <div className="mb-3">
              <label htmlFor="contactName" className="form-label">Your Name</label>
              <input type="text" className="form-control" id="contactName" name="name" placeholder="Enter your name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="contactEmail" className="form-label">Email address</label>
              <input type="email" className="form-control" id="contactEmail" name="email" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label htmlFor="contactMessage" className="form-label">Message</label>
              <textarea className="form-control" id="contactMessage" name="message" rows="4" placeholder="Your message" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Contact;
