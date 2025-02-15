// GeolocationComponent.jsx
import React, { useState, useEffect } from 'react';

const GeolocationComponent = ({ address }) => {
  const [locationJSON, setLocationJSON] = useState('');
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);

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
          const jsonString = JSON.stringify(locationData);
          setLocationJSON(jsonString);
          console.log("User Location JSON:", jsonString);

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
  const thresholdDistance = 0.8;

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <p>
            {locationJSON
              ? `User Location JSON: ${locationJSON}`
              : "Fetching user location..."}
          </p>
          <p>
            {distance !== null
              ? `Distance to ${address}: ${distance.toFixed(2)} km`
              : "Calculating distance..."}
          </p>
          {/* If the user is within the threshold distance, show a notification */}
          {distance !== null && distance <= thresholdDistance && (
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              You're within {thresholdDistance} km of the event!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default GeolocationComponent;
