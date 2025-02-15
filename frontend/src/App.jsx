import React, { useState, useEffect } from "react";
import GeolocationComponent from "./components/Geolocation.jsx";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/App.css";  // Ensure this CSS file exists

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the Django backend (adjust the URL if needed)
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
                    // Prepend the backend URL to the relative image path
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
                  <strong>Estimated Attendees:</strong>{" "}
                  {event.estimated_attendees}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Render the geolocation component */}
        <GeolocationComponent />
      </div>

      <Footer />
    </div>
  );
}

export default App;

