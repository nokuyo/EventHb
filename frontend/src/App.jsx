// import { useState, useEffect } from "react";
// import subu from "./assets/subu.png";
// import GeolocationComponent from "./components/GeolocationTest.jsx"

// function App() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/test_function/")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((json) => {
//         setData(json);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       <h1>Hello world!</h1>
//       {loading && <p>Loading data...</p>}
//       {error && <p style={{ color: "red" }}>Error: {error}</p>}
//       {data && <p>{data.message}</p>}
//       <img src={subu} alt="subu" className="subulol" />
//       <GeolocationComponent />
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Define your backend URL
  const backendUrl = 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/events/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Event List</h1>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} style={{ marginBottom: '2rem' }}>
              <h2>{event.title}</h2>
              {event.image && (
                <img
                  // Prepend the backend URL to the relative image URL
                  src={`${backendUrl}${event.image}`}
                  alt={event.title}
                  style={{ maxWidth: '300px', display: 'block' }}
                />
              )}
              <p>{event.description}</p>
              <p>
                <strong>Host:</strong> {event.host}
              </p>
              <p>
                <strong>Event Time:</strong>{' '}
                {new Date(event.event_time).toLocaleString()}
              </p>
              <p>
                <strong>Location:</strong> {event.event_place}
              </p>
              <p>
                <strong>Estimated Attendees:</strong>{' '}
                {event.estimated_attendees}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
