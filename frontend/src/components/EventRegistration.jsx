import React, { useState } from "react";
import axiosInstance from "../AxiosIntercept";
import "../styles/EventRegistration.css";

const EventRegistration = () => {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [estimatedAttendees, setEstimatedAttendees] = useState(0);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("event_time", eventTime);
    formData.append("event_place", eventPlace.trim());
    formData.append("estimated_attendees", parseInt(estimatedAttendees, 10));

    try {
      const response = await axiosInstance.post(
        "/event_list_view/", // ✅ FIXED — no `/api/` here
        formData
      );

      console.log("Event registration success:", response.data);

      setMessage("Event registered successfully!");
      setIsSuccess(true);
      setShowPopup(true);

      // Reset form
      setImage(null);
      setTitle("");
      setDescription("");
      setEventTime("");
      setEventPlace("");
      setEstimatedAttendees(0);

      // Auto-close popup after 3 seconds if successful
      setTimeout(() => {
        setShowPopup(false);
        window.location.href = "/dashboard";
      }, 3000);
    } catch (error) {
      console.error("Error registering event:", error);

      let errorMsg = "Failed to register event. Please try again.";

      if (error.response) {
        if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        } else if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else {
          errorMsg = "Unexpected server error occurred.";
        }
      } else {
        errorMsg = error.message;
      }

      setMessage(`${errorMsg}`);
      setIsSuccess(false);
      setShowPopup(true);
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Register a New Event</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Image:</label>
          <label htmlFor="file-upload" className="custom-file-label">
            {image ? image.name : "Click to upload"}
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => setImage(e.target.files[0])}
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
            min="0"
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
            {!isSuccess && (
              <button
                onClick={() => setShowPopup(false)}
                className="popup-button"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegistration;
