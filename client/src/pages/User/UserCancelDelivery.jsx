import React, { useState } from "react";
import { authAxios } from "../../utils/auth";

const UserCancelDelivery = ({ deliveryId, userId, onCancelSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancelDelivery = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await authAxios.put(`/api/user/${userId}/delivery/${deliveryId}/cancel`);
      if (response.status === 200) {
        onCancelSuccess(deliveryId);
      }
    } catch (err) {
      setError("Failed to cancel delivery. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cancel-delivery-container mt-2">
      <button
        onClick={cancelDelivery}
        disabled={loading}
        className="text-white bg-gradient-to-bl from-red-500 to-fuchsia-500 hover:scale-110 hover:cursor-pointer shadow-md shadow-gray-500 px-6 py-2 rounded-xl"
      >
        {loading ? "Cancelling..." : "Cancel Order"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default UserCancelDelivery;