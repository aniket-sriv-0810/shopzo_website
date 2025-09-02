import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '../../../assets/black-website-logo.png';
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/reset-password/${token}`, { password });
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error resetting password");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-fuchsia-600">
  {/* Card */}
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
  >
    {/* Logo / Brand */}
    <div className="flex flex-col items-center mb-6">
      <img
        src={logo}
        alt="The Shopzo Logo"
        className="w-28 h-28"
      />
      <h1 className="text-2xl font-extrabold text-purple-700 -mt-4">The Shopzo</h1>
      <p className="text-sm text-center text-gray-500 mt-1">
        Enter a new and strong password <br/>
        Reset your password securely and regain access to your account.
      </p>
    </div>

    {/* Heading */}
    <h2 className="text-xl font-bold text-center mb-6 text-gray-800">
      Reset Password
    </h2>

    {/* Input */}
    <input
      type="password"
      placeholder="password must be at least of 6 characters"
      className="border border-gray-300 p-3 rounded-lg w-full mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={password}
      minLength={6}
      onChange={(e) => setPassword(e.target.value)}
      required
    />


    {/* Submit Button with Spinner */}
    <button
      type="submit"
      disabled={loading}
      className="w-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Resetting...
        </>
      ) : (
        "Reset Password"
      )}
    </button>

    {/* Success/Error message */}
    {msg && (
      <p className="mt-4 text-center text-sm text-gray-600 font-medium">
        {msg}
      </p>
    )}

    {/* Footer text */}
    <p className="mt-6 text-xs text-gray-400 text-center">
      &copy; {new Date().getFullYear()} The Shopzo. All rights reserved.
    </p>
  </form>
</div>

  );
};

export default ResetPassword;
