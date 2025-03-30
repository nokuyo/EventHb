import React, { useState, useEffect } from "react";
import "../styles/Admin.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [editEvent, setEditEvent] = useState({
    image: "",
    title: "",
    description: "",
    event_time: "",
    event_place: "",
    estimated_attendees: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/users/");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRemoveUser = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`http://localhost:8000/users/${selectedUser}/`, {
        method: "DELETE",
      });
      fetchUsers(); // refresh list
      setSelectedUser("");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8000/events/");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleRemoveEvent = async () => {
    if (!selectedEvent) return;
    try {
      await fetch(`http://localhost:8000/events/${selectedEvent}/`, {
        method: "DELETE",
      });
      fetchEvents();
      setSelectedEvent("");
      setEditEvent({});
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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

  const handleEventFieldChange = (field, value) => {
    setEditEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await fetch(
        `http://localhost:8000/events/${selectedEvent}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editEvent),
        }
      );

      if (!response.ok) throw new Error("Failed to save event");

      fetchEvents(); // refresh event list
      alert("Event updated successfully!");
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

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
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        <button className="admin-button" onClick={handleRemoveUser}>
          Remove User
        </button>
      </section>

      {/* Events Section */}
      <section>
        <h2 className="admin-subtitle">Manage Events</h2>
        <p className="admin-text">
          Select an event to remove it, or edit details below.
        </p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "2rem" }}>
          <div>
            <select
              className="admin-dropdown"
              value={selectedEvent}
              onChange={(e) => handleSelectEvent(e.target.value)}
            >
              <option value="">-- Select an event --</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title} ({evt.event_place})
                </option>
              ))}
            </select>
            <button className="admin-button" onClick={handleRemoveEvent}>
              Remove Event
            </button>
          </div>

          {selectedEvent && (
            <div className="admin-event-edit">
              <h3>Edit Event</h3>

              <label>
                <strong>Image URL:</strong>
                <input
                  type="text"
                  value={editEvent.image}
                  onChange={(e) =>
                    handleEventFieldChange("image", e.target.value)
                  }
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
                />
              </label>

              <label>
                <strong>Description:</strong>
                <textarea
                  rows={3}
                  value={editEvent.description}
                  onChange={(e) =>
                    handleEventFieldChange("description", e.target.value)
                  }
                />
              </label>

              <label>
                <strong>Event Time (ISO):</strong>
                <input
                  type="text"
                  value={editEvent.event_time}
                  onChange={(e) =>
                    handleEventFieldChange("event_time", e.target.value)
                  }
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
                />
              </label>

              <label>
                <strong>Estimated Attendees:</strong>
                <input
                  type="number"
                  value={editEvent.estimated_attendees}
                  onChange={(e) =>
                    handleEventFieldChange(
                      "estimated_attendees",
                      parseInt(e.target.value)
                    )
                  }
                />
              </label>

              <button className="admin-button" onClick={handleSaveEvent}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="admin-subtitle">Analytics & Reports</h2>
        <p className="admin-text">Coming soon...</p>
      </section>
    </div>
  );
}
