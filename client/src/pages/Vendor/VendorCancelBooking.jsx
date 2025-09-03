// components/VendorDeleteBooking.jsx
import React from "react";
import axios from "axios";

const VendorCancelBooking = ({ bookingId, userId, productId, onDeleted }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/bookings/${bookingId}/${userId}/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onDeleted?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
    >
      Remove Vendor Order
    </button>
  );
};

export default VendorCancelBooking;
