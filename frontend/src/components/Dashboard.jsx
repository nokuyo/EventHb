import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GeolocationComponent from "./Geolocation.jsx";
import Navbar from "./Navbar.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/Dashboard.css";
import axiosInstance from "../AxiosIntercept";
import { Scanner } from "@yudiel/react-qr-scanner";
import { QRCodeCanvas } from "qrcode.react";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("upcoming");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    axiosInstance
      .get("/all_events/")
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
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === updatedEvent.id
          ? {
              ...ev,
              estimated_attendees: updatedEvent.estimated_attendees,
            }
          : ev
      )
    );
    setAttendanceMessage(`Marked attendance for: ${updatedEvent.title}`);
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

  const handleQRScan = (result) => {
    console.log(" Raw QR scan result:", result);
    if (!Array.isArray(result) || result.length === 0) {
      setAttendanceMessage(" QR Code scan returned an empty result.");
      return;
    }

    const qrText = result[0]?.rawValue;
    console.log(" Extracted QR text from rawValue:", qrText);

    if (!qrText || typeof qrText !== "string") {
      setAttendanceMessage(" QR Code content is not a valid string.");
      return;
    }

    setAttendanceMessage(`Scanned: ${qrText}`);

    const newTab = window.open(qrText, "_blank");
    setTimeout(() => {
      if (newTab && !newTab.closed) newTab.close();
    }, 5000);

    setTimeout(() => setAttendanceMessage(""), 3000);
  };

  return (
    <div className="dashboard-container">
      <div className="header-container">
        <Navbar />
        <Header />
      </div>
      <main className="content">
        {attendanceMessage && (
          <div className="attendance-toast">
            <p>{attendanceMessage}</p>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/event-registration" className="register-event-link">
            Register a New Event
          </Link>
        </div>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <label htmlFor="sort-by">Sort By:</label>
          <select
            id="sort-by"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="upcoming">Upcoming Events</option>
            <option value="closest">Closest Event</option>
            <option value="most_active">Most Active</option>
          </select>
        </div>

        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h3>📸 Scan QR Code to Check In</h3>
          <button onClick={() => setShowQRScanner((prev) => !prev)}>
            {showQRScanner ? "Stop Scanner" : "Start Scanner"}
          </button>
          {showQRScanner && (
            <div style={{ maxWidth: "350px", margin: "20px auto" }}>
              <Scanner
                onScan={(result) => handleQRScan(result)}
                onError={(error) =>
                  console.warn("QR scanner error:", error?.message)
                }
                constraints={{ facingMode: "environment" }}
              />
            </div>
          )}
        </div>

        <h2 className="event-section-title">Nearby Events</h2>
        {loading && <div className="loading-spinner" />}
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
                    src={event.image}
                    alt={event.title}
                    loading="lazy"
                    style={{ maxWidth: "300px", display: "block" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.png";
                    }}
                  />
                )}
                <p>{event.description}</p>
                <p>
                  <strong>Event Time:</strong>{" "}
                  {new Date(event.event_time).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <strong>Location:</strong> {event.event_place}
                </p>
                <p>
                  <strong>Attendees:</strong> {event.estimated_attendees}
                </p>
                <div>
                  <strong>Proximity:</strong>{" "}
                  <GeolocationComponent
                    address={event.event_place}
                    eventId={event.id}
                    estimatedAttendees={event.estimated_attendees}
                    onAttendanceUpdate={handleAttendanceUpdate}
                  />
                </div>

                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  <p>Scan to Check In:</p>
                  <QRCodeCanvas
                    value={`http://localhost:5173/qr-checkin?eventId=${event.id}`}
                    size={128}
                  />
                </div>
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
