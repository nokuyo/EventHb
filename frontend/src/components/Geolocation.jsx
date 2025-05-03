import React, { useState, useEffect } from "react";
import axiosInstance from "../AxiosIntercept";

const GeolocationComponent = ({
  address,
  eventId,
  estimatedAttendees,
  onAttendanceUpdate,
}) => {
  const [locationJSON, setLocationJSON] = useState("");
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [hasAttended, setHasAttended] = useState(false);

  useEffect(() => {
    if (eventId && localStorage.getItem(`attended_${eventId}`)) {
      setHasAttended(true);
    }
  }, [eventId]);

  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
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

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocationJSON(JSON.stringify({ latitude, longitude }));

          try {
            const addressCoords = await geocodeAddress(address);
            const calculatedDistance = haversineDistance(
              latitude,
              longitude,
              addressCoords.latitude,
              addressCoords.longitude
            );
            setDistance(calculatedDistance);
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

  const thresholdDistance = 2;

  const handleAttend = async () => {
    if (!eventId) {
      console.warn(" Missing eventId, cannot update attendance.");
      setUpdateMessage("Error: Invalid event ID.");
      return;
    }

    if (hasAttended) {
      setUpdateMessage("You have already marked your attendance.");
      return;
    }

    try {
      console.log("📡 Sending attendance for eventId:", eventId);
      const response = await axiosInstance.post(`/event_list_view/`, {
        event_id: eventId,
        increment: 1,
      });

      const updatedEvent = response.data?.event || response.data;
      if (onAttendanceUpdate) {
        onAttendanceUpdate(updatedEvent);
      }

      setUpdateMessage(" Attendance updated!");
      setHasAttended(true);
      localStorage.setItem(`attended_${eventId}`, "true");
    } catch (error) {
      console.error("Error updating attendance:", error.response || error);
      setUpdateMessage(" Error updating attendance.");
    }
  };

  return (
    <div>
      {error ? (
        <p style={{ color: "red" }}>Error: {error}</p>
      ) : (
        <>
          <p>
            {distance !== null
              ? `Distance to ${address}: ${distance.toFixed(2)} km`
              : "Calculating distance..."}
          </p>
          {distance !== null && distance <= thresholdDistance && (
            <>
              <p style={{ fontWeight: "bold" }}>
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
