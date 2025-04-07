import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosIntercept";

const EditEvent = () => {
  const { id } = useParams(); // Grab event ID from the URL
  const navigate = useNavigate(); // Replace useHistory with useNavigate
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventPlace, setEventPlace] = useState("");
  const [estimatedAttendees, setEstimatedAttendees] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch the details for the specific event so the form is pre-populated
    axiosInstance
      .get(`/events/${id}/`)
      .then((response) => {
        const data = response.data;
        setEventData(data);
        setTitle(data.title);
        setDescription(data.description);
        setEventTime(data.event_time);
        setEventPlace(data.event_place);
        setEstimatedAttendees(data.estimated_attendees);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Use FormData to handle potential file uploads
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_time", eventTime);
    formData.append("event_place", eventPlace);
    formData.append("estimated_attendees", estimatedAttendees);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axiosInstance.put(`/events/${id}/`, formData);
      // After successful update, navigate to the user events page
      navigate("/user-events");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="edit-event-container">
      <h2>Edit Event</h2>
      <p>Editing event: {eventData.title}</p>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Time:</label>
          <input
            type="datetime-local"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Place:</label>
          <input
            type="text"
            value={eventPlace}
            onChange={(e) => setEventPlace(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Estimated Attendees:</label>
          <input
            type="number"
            value={estimatedAttendees}
            onChange={(e) => setEstimatedAttendees(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
