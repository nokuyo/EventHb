// QRCheckin.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosIntercept";

const QRCheckin = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Processing your check-in...");
  const navigate = useNavigate();

  // Extract the eventId from the URL query string.
  const eventId = searchParams.get("eventId");

  useEffect(() => {
    // Define an async function to perform the check-in.
    async function checkIn() {
      if (eventId) {
        try {
          const response = await axiosInstance.post(`/event_list_view/`, {
            event_id: eventId,
            increment: 1,
          });
          const updatedEvent = response.data;
          setMessage(`✅ Attendance marked for: ${updatedEvent.title}`);
          // Redirect back to the dashboard after a brief delay.
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        } catch (error) {
          console.error("Error during check-in:", error);
          setMessage("❌ Failed to mark attendance.");
        }
      } else {
        setMessage("❌ No event specified.");
      }
    }

    checkIn();
  }, [eventId, navigate]);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h2>QR Check-In</h2>
      <p>{message}</p>
    </div>
  );
};

export default QRCheckin;
