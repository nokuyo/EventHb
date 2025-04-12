import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GeolocationComponent from "./Geolocation.jsx";
import Navbar from "./Navbar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/Dashboard.css";
import axiosInstance from "../AxiosIntercept";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("upcoming");
  const [attendanceMessage, setAttendanceMessage] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/event_list_view/")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAttendanceUpdate = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );

    // ✅ Show a quick feedback message
    setAttendanceMessage(`✅ Marked attendance for: ${updatedEvent.title}`);
    setTimeout(() => setAttendanceMessage(""), 3000);
  };

  const sortEvents = (events, sortBy) => {
    const cloned = [...events];
    switch (sortBy) {
      case "upcoming":
        return cloned
          .filter((event) => new Date(event.event_time) > new Date())
          .sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
      case "closest":
        return cloned.sort(
          (a, b) =>
            Math.abs(new Date(a.event_time) - new Date()) -
            Math.abs(new Date(b.event_time) - new Date())
        );
      case "most_active":
        return cloned.sort(
          (a, b) => b.estimated_attendees - a.estimated_attendees
        );
      default:
        return cloned;
    }
  };

  const sortedEvents = sortEvents(events, sortBy);

  return (
    <div className="dashboard-container">
      {/* Navbar + Header */}
      <div className="header-container">
        <Navbar />
        <Header />
      </div>

      <main className="content">
        {/* ✅ Attendance Toast */}
        {attendanceMessage && (
          <div className="attendance-toast">
            <p>{attendanceMessage}</p>
          </div>
        )}

        {/* Register New Event */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/event-registration" className="register-event-link">
            Register a New Event
          </Link>
        </div>

        {/* Sorting Options */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="closest">Closest Event</option>
            <option value="most_active">Most Active</option>
          </select>
        </div>

        <h2 className="event-section-title">Nearby Events</h2>
        {loading && <p>Loading events...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && sortedEvents.length === 0 && (
          <p>No events available.</p>
        )}

        {!loading && !error && sortedEvents.length > 0 && (
          <div className="event-list">
            {sortedEvents.map((event) => (
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
                  <strong>Attendees:</strong> {event.estimated_attendees}
                </p>
                <p>
                  <strong>Proximity:</strong>{" "}
                  <GeolocationComponent
                    address={event.event_place}
                    eventId={event.id}
                    estimatedAttendees={event.estimated_attendees}
                    onAttendanceUpdate={handleAttendanceUpdate}
                  />
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
