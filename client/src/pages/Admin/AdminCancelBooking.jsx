// components/AdminDeleteBooking.jsx
import React from "react";
import { authAxios } from "../../utils/auth";

const AdminCancelBooking = ({ bookingId, onDeleted }) => {

  const handleDelete = async () => {
    try {
      const response = await authAxios.delete(`/api/admin/booking/${bookingId}/cancel`);
      onDeleted?.(); // optional callback
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to delete booking");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Delete Orders
    </button>
  );
};

export default AdminCancelBooking;
