// components/AdminDeleteBooking.jsx
import React from "react";
import axios from "axios";

const AdminCancelBooking = ({ bookingId, onDeleted }) => {

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/bookings/${bookingId}`,
        {
            withCredentials : true
        }
      );
      alert(data.message || "Booking deleted successfully");
      onDeleted?.(); // optional callback
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Delete Booking
    </button>
  );
};

export default AdminCancelBooking;
