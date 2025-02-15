// EventRegistration.jsx
import React, { useState } from "react";

const EventRegistration = () => {
  // State for each form field
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [estimatedAttendees, setEstimatedAttendees] = useState(0);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object because we're sending an image file.
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_time", eventTime); // Expecting an ISO formatted string.
    formData.append("event_place", eventPlace);
    formData.append("estimated_attendees", estimatedAttendees);

    try {
      const response = await fetch("http://localhost:8000/api/events/", {
        method: "POST",
        // Don't set 'Content-Type' header when using FormData.
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMessage("Event registered successfully!");
      
      // Optionally reset the form:
      setImage(null);
      setTitle("");
      setDescription("");
      setEventTime("");
      setEventPlace("");
      setEstimatedAttendees(0);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Event Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Image: </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Event Time: </label>
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Event Place: </label>
          <input
            type="text"
            value={eventPlace}
            onChange={(e) => setEventPlace(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estimated Attendees: </label>
          <input
            type="number"
            value={estimatedAttendees}
            onChange={(e) => setEstimatedAttendees(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EventRegistration;
