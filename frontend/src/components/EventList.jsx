import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";  // ✅ Ensure no curly braces (default export)

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/events/")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events");
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => {
        console.error("EventList Error:", err);
        setError(err.message);
      });
  }, []);

  return (
    <div className="event-list">
      {error && <p style={{ color: "red" }}>Error loading events: {error}</p>}
      {events.length === 0 && !error ? <p>No events found.</p> : null}
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
