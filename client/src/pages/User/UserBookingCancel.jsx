// components/User/UserBooking/CancelBooking.jsx
import React, { useState } from "react";
import axios from "axios";

const CancelBooking = ({ bookingId, userId, onCancelSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancelBooking = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/account/bookings/${bookingId}/cancel`,
        { withCredentials: true }
        
      );

      if (response.status === 200) {
        // Notify the parent component about the successful cancellation
        onCancelSuccess(bookingId);
        alert("Booking cancelled successfully!");
      }
    } catch (err) {
      setError("Failed to cancel booking. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-booking-container mt-2">
      <button
        onClick={cancelBooking}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Cancelling..." : "Cancel Booking"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CancelBooking;
