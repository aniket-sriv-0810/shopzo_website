import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle } from "react-icons/fa";

const iconMap = {
  name: <FaUser className="text-indigo-600" />,
  phone: <FaPhone className="text-indigo-600" />,
  email: <FaEnvelope className="text-indigo-600" />,
};

const UserAccountForm = ({ userData, handleChange, handleSubmit, isLoading, fieldErrors }) => {
  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      {["name", "phone", "email"].map((field) => (
        <div key={field} className="relative">
          <label htmlFor={field} className="block text-sm font-semibold text-gray-800 capitalize mb-1">
            {field}
          </label>
          <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-500">
            <span className="mr-3">{iconMap[field]}</span>
            <input
              type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              name={field}
              id={field}
              value={userData[field]}
              onChange={handleChange}
              className="flex-1 border-none focus:outline-none bg-transparent text-sm placeholder-gray-400"
              placeholder={`Enter your ${field}`}
            />
          </div>
          {fieldErrors[field] && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors[field]}</p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
          isLoading
            ? "bg-gradient-to-r from-indigo-400 to-purple-400 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-700 hover:to-indigo-700"
        }`}
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <FaCheckCircle />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
};

export default UserAccountForm;
