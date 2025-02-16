// Admin.jsx
import React, { useState, useEffect } from "react";
import "../styles/Admin.css";

export default function Admin() {
  /* #region User functions */
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // GET /api/users/ - Adjust to match your Django endpoint
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/");
      if (!response.ok) {
        throw new Error(`Failed to fetch users. Status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Placeholder function for removing a user
  const handleRemoveUser = () => {
    if (!selectedUser) {
      console.log("No user selected");
      return;
    }
    console.log(`Remove user with ID: ${selectedUser}`);
    // TODO: send DELETE request to remove user, then refetch
  };
  /* #endregion */

  /* #region Event functions */
  // Start with an empty array for events
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  // State for editing the selected event
  const [editEvent, setEditEvent] = useState({
    image: "",
    title: "",
    description: "",
    event_time: "",
    event_place: "",
    estimated_attendees: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  // GET /api/events/ - Adjust to match your Django endpoint
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/events/");
      if (!response.ok) {
        throw new Error(`Failed to fetch events. Status: ${response.status}`);
      }
      const data = await response.json();
      // Directly set the fetched data to events
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Placeholder function for removing an event
  const handleRemoveEvent = () => {
    if (!selectedEvent) {
      console.log("No event selected");
      return;
    }
    console.log(`Remove event with ID: ${selectedEvent}`);
    // TODO: send DELETE request to remove event, then refetch
  };

  // When an event is chosen from the dropdown, set selectedEvent
  // and fill editEvent with the event's current data.
  const handleSelectEvent = (eventId) => {
    setSelectedEvent(eventId);
    const foundEvent = events.find((evt) => String(evt.id) === String(eventId));
    if (foundEvent) {
      setEditEvent({
        image: foundEvent.image || "",
        title: foundEvent.title || "",
        description: foundEvent.description || "",
        event_time: foundEvent.event_time || "",
        event_place: foundEvent.event_place || "",
        estimated_attendees: foundEvent.estimated_attendees || 0,
      });
    }
  };

  // Update the editEvent state whenever a field changes
  const handleEventFieldChange = (field, value) => {
    setEditEvent((prev) => ({ ...prev, [field]: value }));
  };

  // Save the edited event (currently just logs it)
  const handleSaveEvent = () => {
    if (!selectedEvent) {
      console.log("No event selected to save");
      return;
    }
    console.log("Saving event with ID:", selectedEvent, editEvent);
    // TODO: send PUT/PATCH request to update event, then refetch
  };
  /* #endregion */

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      
      {/* Users Section */}
      <section>
        <h2 className="admin-subtitle">Manage Users</h2>
        <p className="admin-text">
          Select a user from the dropdown to remove them.
        </p>
        <select
          className="admin-dropdown"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Select a user --</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))
          ) : (
            <option disabled>No user found</option>
          )}
        </select>
        <button className="admin-button" onClick={handleRemoveUser}>
          Remove User
        </button>
      </section>
      



      {/* Manage Events Section */}
      <section>
        <h2 className="admin-subtitle">Manage Events</h2>
        <p className="admin-text">
          Select an event from the dropdown to remove it, or edit its details on
          the right and click "Save Changes."
        </p>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <div>
            <select
              className="admin-dropdown"
              value={selectedEvent}
              onChange={(e) => handleSelectEvent(e.target.value)}
            >
              <option value="">-- Select an event --</option>
              {events.length > 0 ? (
                events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.event_place})
                  </option>
                ))
              ) : (
                <option disabled>No event found</option>
              )}
            </select>
            <button className="admin-button" onClick={handleRemoveEvent}>
              Remove Event
            </button>
          </div>

          {selectedEvent && (
            <div className="admin-event-edit">
              <h3>Edit Event</h3>
              <label>
                <strong>Image:</strong>
                <input
                  type="text"
                  value={editEvent.image}
                  onChange={(e) =>
                    handleEventFieldChange("image", e.target.value)
                  }
                  style={{ display: "block", margin: "8px 0" }}
                />
              </label>
              <label>
                <strong>Title:</strong>
                <input
                  type="text"
                  value={editEvent.title}
                  onChange={(e) =>
                    handleEventFieldChange("title", e.target.value)
                  }
                  style={{ display: "block", margin: "8px 0" }}
                />
              </label>
              <label>
                <strong>Description:</strong>
                <textarea
                  value={editEvent.description}
                  onChange={(e) =>
                    handleEventFieldChange("description", e.target.value)
                  }
                  rows={3}
                  style={{ display: "block", width: "300px", margin: "8px 0" }}
                />
              </label>
              <label>
                <strong>Event Time:</strong>
                <input
                  type="text"
                  value={editEvent.event_time}
                  onChange={(e) =>
                    handleEventFieldChange("event_time", e.target.value)
                  }
                  style={{ display: "block", margin: "8px 0" }}
                />
              </label>
              <label>
                <strong>Event Place:</strong>
                <input
                  type="text"
                  value={editEvent.event_place}
                  onChange={(e) =>
                    handleEventFieldChange("event_place", e.target.value)
                  }
                  style={{ display: "block", margin: "8px 0" }}
                />
              </label>
              <label>
                <strong>Estimated Attendees:</strong>
                <input
                  type="number"
                  value={editEvent.estimated_attendees}
                  onChange={(e) =>
                    handleEventFieldChange("estimated_attendees", e.target.value)
                  }
                  style={{ display: "block", margin: "8px 0" }}
                />
              </label>

              <button className="admin-button" onClick={handleSaveEvent}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </section>



      {/* Analytics & Reports Section */}
      <section>
        <h2 className="admin-subtitle">Analytics & Reports</h2>
        <p className="admin-text">
          View site usage stats, generate reports, etc. (Coming soon... Maybe)
        </p>
      </section>
    </div>
  );
}
