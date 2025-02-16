import React, { useState, useEffect } from "react";

const GeolocationComponent = ({ address, eventId, estimatedAttendees, onAttendanceUpdate }) => {
  const [locationJSON, setLocationJSON] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [hasAttended, setHasAttended] = useState(false); // Track attendance

  useEffect(() => {
    // Ensure localStorage has a valid entry for this event
    if (eventId && localStorage.getItem(`attended_${eventId}`)) {
      setHasAttended(true);
    }
  }, [eventId]);

  // Function to geocode an address using the Nominatim API
  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        throw new Error("No results found for the provided address.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      throw error;
    }
  };

  // Haversine formula to calculate distance between two coordinates (in km)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = { latitude, longitude };
          setLocationJSON(JSON.stringify(locationData));
          console.log("User Location JSON:", locationData);

          try {
            const addressCoords = await geocodeAddress(address);
            console.log("Address Coordinates:", addressCoords);
            const calculatedDistance = haversineDistance(
              latitude,
              longitude,
              addressCoords.latitude,
              addressCoords.longitude
            );
            setDistance(calculatedDistance);
            console.log(`Distance to ${address}: ${calculatedDistance.toFixed(2)} km`);
          } catch (err) {
            console.error("Error processing address:", err);
            setError("Error geocoding address or calculating distance.");
          }
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [address]);

  // Define a threshold distance (in km) for the notification
  const thresholdDistance = 1;

  const handleAttend = async () => {
    if (hasAttended) {
      setUpdateMessage("You have already marked your attendance.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/attend/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const updatedEvent = await response.json();
      if (onAttendanceUpdate) {
        onAttendanceUpdate(updatedEvent);
      }
      setUpdateMessage("Attendance updated!");
      setHasAttended(true);
      localStorage.setItem(`attended_${eventId}`, "true");
    } catch (error) {
      console.error("Error updating event:", error);
      setUpdateMessage("Error updating attendance.");
    }
  };

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <p>
            {distance !== null
              ? `Distance to ${address}: ${distance.toFixed(2)} km`
              : "Calculating distance..."}
          </p>
          {distance !== null && distance <= thresholdDistance && (
            <>
              <p style={{ color: "black", fontWeight: "bold" }}>
                You're close to this event! Click below to mark your attendance:
              </p>
              <button onClick={handleAttend} disabled={hasAttended}>
                {hasAttended ? "Attendance Marked" : "I'm Here"}
              </button>
              {updateMessage && <p>{updateMessage}</p>}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default GeolocationComponent;
