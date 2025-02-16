import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import fakeEvents from "/src/fakeEvents.json";

function EventList() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [useFakeData, setUseFakeData] = useState(true); // Toggle between API and JSON
  const [sortBy, setSortBy] = useState("upcoming"); // Sorting criteria

  // Helper function to sort events
  const sortEvents = (events, sortBy) => {
    switch (sortBy) {
      case "upcoming":
        // Sort by event time in ascending order (future events first)
        return events.filter(event => new Date(event.event_time) > new Date()).sort((a, b) => new Date(a.event_time) - new Date(b.event_time));
      case "closest":
        // Sort by proximity to the current time
        return events.sort((a, b) => Math.abs(new Date(a.event_time) - new Date()) - Math.abs(new Date(b.event_time) - new Date()));
      case "most_active":
        // Sort by estimated attendees in descending order
        return events.sort((a, b) => b.estimated_attendees - a.estimated_attendees);
      default:
        return events;
    }
  };

  useEffect(() => {
    if (useFakeData) {
      // ✅ Using fake JSON data
      setEvents(fakeEvents);
    } else {
      // ✅ Fetching from backend API
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

  // Apply sorting to the events
  const sortedEvents = sortEvents(events, sortBy);

  return (
    <div className="event-list">
      {/* Toggle Button */}
      <button onClick={() => setUseFakeData(!useFakeData)} className="toggle-btn">
        {useFakeData ? "Switch to Backend API" : "Switch to Fake Data"}
      </button>

      {/* Sorting Dropdown */}
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

      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>Error loading events: {error}</p>}

      {/* Display Events */}
      {sortedEvents.length === 0 && !error ? (
        <p>No events found.</p>
      ) : (
        sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  );
}

export default EventList;