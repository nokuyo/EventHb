import React from "react";

function EventCard({ event }) {
  return (
    <div className="event-card">
      {/* Event Image */}
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="event-image"
          style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
        />
      )}

      {/* Event Details */}
      <h2>{event.title}</h2>
      <p>
        <strong>Host:</strong> {event.host}
      </p>
      <p>{event.description}</p>
      <p>
        <strong>Time & Place:</strong> {event.time}, {event.place}
      </p>
      <p>
        <strong>Attendees:</strong> {event.attendees} people
      </p>
    </div>
  );
}

export default EventCard;
