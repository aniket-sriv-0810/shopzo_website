import React, { useState } from "react";
import axios from "axios";
import logo from '../../../assets/black-website-logo.png';
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/forgot-password`,
        { email }
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error sending reset email");
    }finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 to-fuchsia-600">
  {/* Card */}
  <form
    onSubmit={handleSubmit}
    className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center"
  >
    {/* Logo */}
    <div className="mb-6">
      <img
        src={logo}
        alt="The Shopzo Logo"
        className="mx-auto w-28 h-28 object-cover"
      />
      <h1 className="text-xl font-extrabold text-purple-700 -mt-5">
        The Shopzo
      </h1>
    </div>

    {/* Heading */}
    <h2 className="text-2xl font-bold mb-2 text-gray-800">
      Forgot Your Password?
    </h2>
    <p className="text-sm text-gray-500 mb-6">
      Enter your registered email address and we’ll send you a secure link 
      to reset your password.
    </p>

    {/* Input */}
    <input
      type="email"
      placeholder="Enter your registered email"
      className="border border-gray-300 p-3 rounded-lg w-full mb-5 focus:outline-none focus:ring-2 focus:ring-purple-500"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />

    {/* Button */}
     {/* Submit Button with Spinner */}
    <button
      type="submit"
      disabled={isLoading}
      className="w-full hover:cursor-pointer bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Sending...
        </>
      ) : (
        "Send Reset Link"
      )}
    </button>

    {/* Message */}
    {msg && <p className="mt-4 text-sm font-normal text-red-600">{msg}</p>}
    {/* Footer text */}
    <p className="mt-6 text-xs text-gray-400 text-center">
      &copy; {new Date().getFullYear()} The Shopzo. All rights reserved.
    </p>
  </form>
</div>

  );
};

export default ForgotPassword;
