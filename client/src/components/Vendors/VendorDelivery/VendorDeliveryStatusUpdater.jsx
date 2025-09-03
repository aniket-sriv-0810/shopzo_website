import React, { useState } from 'react';
import axios from 'axios';

const VendorDeliveryStatusUpdater = ({ vendorId, deliveryId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/deliveries/${deliveryId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      console.log('Status updated successfully:', response.data);
      onStatusUpdate(response.data.data);
      setStatus(newStatus);
    } catch (error) {
      console.error('Failed to update status:', error.response?.data?.message || error.message);
      // Revert status on failure
      setStatus(currentStatus);
    } finally {
      setLoading(false);
    }
  };

  // Determine the color class based on the current status
  const statusColorClass = {
    pending: 'bg-yellow-500 text-white',
    completed: 'bg-green-600 text-white',
    cancelled: 'bg-red-500 text-white',
  }[status] || 'bg-gray-200 text-gray-800'; // Default class

  return (
    <select
      value={status}
      onChange={handleStatusChange}
      disabled={loading}
      className={`p-1 px-3 rounded-full font-medium transition-colors duration-200 border-2 border-transparent focus:outline-none ${statusColorClass} ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <option value="pending">pending</option>
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
    </select>
  );
};

export default VendorDeliveryStatusUpdater;
