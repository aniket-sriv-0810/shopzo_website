// components/UserDeleteCancelledBooking.jsx
import React from "react";
import axios from "axios";

const UserCancelBooking = ({ bookingId, onDeleted }) => {

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/bookings/${bookingId}`,
        {
            withCredentials : true
        }
      );
      alert(data.message || "Cancelled booking deleted");
      onDeleted?.();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting cancelled booking");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
    >
      Delete Cancelled Booking
    </button>
  );
};

export default UserCancelBooking;
