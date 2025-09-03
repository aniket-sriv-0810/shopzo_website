import React, { useState } from 'react';
import axios from 'axios';

const VendorDeliveryStatusUpdater = ({ vendorId, deliveryId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/deliveries/${deliveryId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      console.log('Status updated successfully:', response.data);
      onStatusUpdate(response.data.data);
    } catch (error) {
      console.error('Failed to update status:', error.response?.data?.message || error.message);
      // Revert status on failure
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className="p-1 rounded border border-gray-300 bg-white"
    >
      <option value="pending">Pending</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
};

export default VendorDeliveryStatusUpdater;
