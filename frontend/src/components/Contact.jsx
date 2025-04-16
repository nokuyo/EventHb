import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

function Contact() {
  return (
    <div className="dashboard-container">
      <div className="header-container">
        <Navbar />
      </div>

      <main className="content">
        <div className="container">
          <h1>Contact Us</h1>

          <h2>Get in Touch</h2>
          <p>
            Have questions or need support? Please fill out the form below, and
            our team will get back to you as soon as possible. We take reports
            seriously and will investigate all reported events.
          </p>

          <form action="/contact" method="POST" className="contact-form">
            <div>
              <label htmlFor="contactName">Your Name</label>
              <input
                type="text"
                id="contactName"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="contactEmail">Email address</label>
              <input
                type="email"
                id="contactEmail"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="contactMessage">Message</label>
              <textarea
                id="contactMessage"
                name="message"
                rows="4"
                placeholder="Your message"
                required
              ></textarea>
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </main>

      <Footer />

      {/* Embedded styling for the form */}
      <style>{`
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .contact-form label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .contact-form input,
        .contact-form textarea {
          padding: 0.75rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
          width: 100%;
        }

        .contact-form button[type="submit"] {
          padding: 0.75rem;
          font-size: 1rem;
          background-color: #007bff;
          border: none;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
        }

        .contact-form button[type="submit"]:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default Contact;
