// components/VendorDeleteBooking.jsx
import React from "react";
import { authAxios } from "../../utils/auth";

const VendorCancelBooking = ({ bookingId, userId, productId, onDeleted }) => {
  const token = localStorage.getItem("token");

  const handleDelete = async () => {
    try {
      const response = await authAxios.put(`/api/vendor/${vendorId}/booking/${bookingId}/cancel`);
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
