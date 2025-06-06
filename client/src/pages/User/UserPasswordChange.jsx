import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext/userContext';

const UserPasswordChange = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate  = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      return setError('All fields are required.');
    }

    if (newPassword !== confirmPassword) {
      return setError('New password and confirmation do not match.');
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}/account/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setSuccess(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigate(`/user/${user._id}/account`);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid Password Credentials !');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 via-white to-pink-100">
      <div className="w-full max-w-md bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-40 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm border border-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-sm border border-green-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Old Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              placeholder="Enter your old password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-70 border border-gray-300 placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 shadow-md ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>

      
      </div>
    </div>
  );
};

export default UserPasswordChange;
