import { useState, useEffect } from "react";
import GeolocationComponent from "./components/Geolocation.jsx";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EventList from "./components/EventList";
import "./styles/App.css";  // Make sure to create and link this CSS file

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/test_function/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Navbar />
      <Header />

      <div className="container">
        {/* Centered Event Section */}
        <h2 className="event-section-title">Nearby Events</h2>
        <EventList />

        {/* Geolocation Component */}
        <GeolocationComponent />

        {/* Display API Test Data (if needed) */}
        {loading && <p>Loading data...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {data && <p>{data.message}</p>}
      </div>

      <Footer />
    </div>
  );
}

export default App;
