import React, { useState } from 'react';
import axios from 'axios';

const VendorPaymentStatusUpdater = ({ vendorId, bookingId, currentStatus, onStatusUpdate }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validStatuses = ['pending', 'cancelled', 'completed'];

  const handleStatusChange = async (newStatus) => {
    if (newStatus === status || (status === 'completed' && newStatus !== 'completed')) return;

    setLoading(true);
    setError('');
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/bookings/${bookingId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setStatus(newStatus);
      setSuccessMsg(`Updated to "${newStatus}"`);
      onStatusUpdate(newStatus);
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 font-semibold text-white';
      case 'pending':
        return 'bg-yellow-500 font-semibold text-white';
      case 'cancelled':
        return 'bg-red-500 font-semibold text-white';
      default:
        return 'bg-gray-300 text-black';
    }
  };

  return (
    <div className="flex flex-col items-center p-1 space-y-1 text-xs">
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value)}
        disabled={status === 'completed'}
        className={`px-4 py-2 border-gray-800 rounded-md border cursor-pointer transition-all ${getStatusColor(status)} ${
          status === 'completed' ? 'opacity-80 cursor-not-allowed' : ''
        }`}
      >
        {validStatuses.map((s) => (
          <option
            key={s}
            value={s}
            disabled={status === 'completed' && s !== 'completed'}
            className="text-white"
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      {loading && <span className="text-gray-500">Updating...</span>}
      {error && <span className="text-red-500">{error}</span>}
      {successMsg && <span className="text-green-600">{successMsg}</span>}
    </div>
  );
};

export default VendorPaymentStatusUpdater;
