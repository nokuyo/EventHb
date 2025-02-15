import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import GeolocationComponent from "./Geolocation.jsx";
import Navbar from "./Navbar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/Dashboard.css"; // Ensure this CSS file exists

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the Django backend
  useEffect(() => {
    fetch("http://localhost:8000/api/event_list_view/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setEvents(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <div className="container">
        {/* Add a link to the Event Registration page */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/event-registration" className="register-event-link">
            Register a New Event
          </Link>
        </div>

        <h2 className="event-section-title">Nearby Events</h2>
        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && events.length === 0 && (
          <p>No events available.</p>
        )}
        {!loading && !error && events.length > 0 && (
          <ul>
            {events.map((event) => (
              <li key={event.id} style={{ marginBottom: "2rem" }}>
                <h3>{event.title}</h3>
                {event.image && (
                  <img
                    src={`http://localhost:8000${event.image}`}
                    alt={event.title}
                    style={{ maxWidth: "300px", display: "block" }}
                  />
                )}
                <p>{event.description}</p>
                <p>
                  <strong>Host:</strong> {event.host}
                </p>
                <p>
                  <strong>Event Time:</strong>{" "}
                  {new Date(event.event_time).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {event.event_place}
                </p>
                <p>
                  <strong>Estimated Attendees:</strong> {event.estimated_attendees}
                </p>
                <p>
                  <strong>Proximity:</strong>{" "}
                  <GeolocationComponent address={event.event_place} />
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;