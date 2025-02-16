// EventRegistration.jsx
import React, { useState } from "react";
import "../styles/EventRegistration.css"; // Import the CSS file

const EventRegistration = () => {
  // State for each form field
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [estimatedAttendees, setEstimatedAttendees] = useState(0);

  // State for the popup message and whether it's visible
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object because we're sending an image file.
    const formData = new FormData();
    if (image) {
      formData.append("image", image);
    }
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_time", eventTime);
    formData.append("event_place", eventPlace);
    formData.append("estimated_attendees", estimatedAttendees);

    try {
      const response = await fetch("http://localhost:8000/api/events/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setMessage("Event registered successfully!");
      setShowPopup(true);

      // Optionally reset the form
      setImage(null);
      setTitle("");
      setDescription("");
      setEventTime("");
      setEventPlace("");
      setEstimatedAttendees(0);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setShowPopup(true);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Event Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label>Event Time:</label>
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Event Place:</label>
          <input
            type="text"
            value={eventPlace}
            onChange={(e) => setEventPlace(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Estimated Attendees:</label>
          <input
            type="number"
            value={estimatedAttendees}
            onChange={(e) => setEstimatedAttendees(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="form-button">
          Register Event
        </button>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="form-message">{message}</p>
            <button
              onClick={() => {
                setShowPopup(false);
                window.location.href = "/";
              }}
            >
              return to Events
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistration;
