import React, { useState, useEffect } from 'react';

const GeolocationComponent = () => {
  const [locationJSON, setLocationJSON] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Create a JSON string from the latitude and longitude
          const locationData = { latitude, longitude };
          const jsonString = JSON.stringify(locationData);
          setLocationJSON(jsonString);
          console.log("Location JSON:", jsonString);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          {locationJSON
            ? `Location JSON: ${locationJSON}`
            : "Fetching location..."}
        </p>
      )}
    </div>
  );
};

export default GeolocationComponent;
