import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../../components/UserContext/userContext';

const VendorPasswordChange = () => {
  const { user } = useUser();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
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
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${user._id}/account/change-password`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );

      setSuccess(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Something went wrong!';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-gray-900 to-black px-4 py-8">
      <div className="w-full max-w-md glassmorphism p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-sm">
          🔐 Change Password
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-md text-sm mb-4 border border-red-400/50 backdrop-blur">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-md text-sm mb-4 border border-green-400/50 backdrop-blur">
            {success}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* Old Password */}
          <div>
            <label htmlFor="oldPassword" className="text-gray-200 text-sm mb-1 block">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg backdrop-blur placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/20 transition-all duration-200"
              placeholder="Enter your old password"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="text-gray-200 text-sm mb-1 block">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg backdrop-blur placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/20 transition-all duration-200"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="text-gray-200 text-sm mb-1 block">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 text-white border border-white/20 rounded-lg backdrop-blur placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white/20 transition-all duration-200"
              placeholder="Confirm your new password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 shadow-md ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Updating Password...' : 'Change Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to={`/vendor/${user._id}/account`}
            className="text-sm text-pink-400 hover:text-pink-300 underline transition"
          >
            ← Back to Profile
          </Link>
        </div>
      </div>

      {/* Custom Glassmorphism Styles */}
      <style>{`
        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};

export default VendorPasswordChange;
