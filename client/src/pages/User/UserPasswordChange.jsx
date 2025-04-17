import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../components/UserContext/userContext';
const UserPasswordChange = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
 const {user} = useUser();
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
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/${user._id}/account/change-password`, {
        oldPassword,
        newPassword,
      }, 
    {withCredentials: true});

      setSuccess(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h2>

        {error && <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 px-4 py-2 rounded mb-4 text-sm">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your old password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter new password"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm your new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to={`user/${user._id}/account`} className="text-sm text-indigo-600 hover:text-indigo-700 underline">
            ⬅ Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserPasswordChange;
