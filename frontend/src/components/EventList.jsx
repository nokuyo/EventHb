import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import fakeEvents from "/src/fakeEvents.json";


function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [useFakeData, setUseFakeData] = useState(true); // Toggle between API and JSON

  useEffect(() => {
    if (useFakeData) {
      // ✅ Using fake JSON data
      setEvents(fakeEvents);
    } else {
      // ✅ Fetching from backend API (Commented out for now)
      fetch("http://localhost:8000/api/event_list_view/")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch events");
          return res.json();
        })
        .then((data) => setEvents(data))
        .catch((err) => {
          console.error("EventList Error:", err);
          setError(err.message);
        });
    }
  }, [useFakeData]); // Re-run effect when toggled

  return (
    <div className="event-list">
      <button onClick={() => setUseFakeData(!useFakeData)} className="toggle-btn">
        {useFakeData ? "Switch to Backend API" : "Switch to Fake Data"}
      </button>

      {error && <p style={{ color: "red" }}>Error loading events: {error}</p>}
      {events.length === 0 && !error ? <p>No events found.</p> : null}
      
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default EventList;
