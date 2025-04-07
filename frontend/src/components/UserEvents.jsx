import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../AxiosIntercept";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const UserEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events created by the current user using your custom endpoint
    axiosInstance
      .get("/events/my-events/")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="user-events-container">
      <Navbar />
      <main className="content">
        <h2>Your Events</h2>
        {loading && <p>Loading your events...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && events.length === 0 && (
          <p>You haven't created any events yet.</p>
        )}
        {!loading && events.length > 0 && (
          <div className="event-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <h3>{event.title}</h3>
                {event.image && (
                  <img
                    src={
                      event.image.startsWith("http")
                        ? event.image
                        : `/media/event_images/${event.image}`
                    }
                    alt={event.title}
                    style={{ maxWidth: "300px", display: "block" }}
                  />
                )}
                <p>{event.description}</p>
                <p>
                  <strong>Event Time:</strong>{" "}
                  {new Date(event.event_time).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {event.event_place}
                </p>
                <p>
                  <strong>Attendees:</strong> {event.estimated_attendees}
                </p>
                <div style={{ textAlign: "center", marginTop: "10px" }}>
                  {/* Button to navigate to the edit page for this event */}
                  <Link to={`/edit-event/${event.id}`} className="edit-event-button">
                    Edit Event
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default UserEvents;
