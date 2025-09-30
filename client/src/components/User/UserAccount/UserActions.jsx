import React from "react";
import { FaEdit, FaKey, FaTrashAlt } from "react-icons/fa";

const UserActions = ({ navigate }) => {
  const handleEditDetails = () => {
    navigate("edit");
  };

  const handleChangePassword = () => {
    navigate("change-password");
  };

  const handleDeleteAccount = () => {
    navigate("delete");
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6">
        Account Actions
      </h3>
      
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <button
          onClick={handleEditDetails}
          className="flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <FaEdit className="text-sm md:text-base" />
          <span className="text-sm md:text-base">Edit Details</span>
        </button>

        <button
          onClick={handleChangePassword}
          className="flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <FaKey className="text-sm md:text-base" />
          <span className="text-sm md:text-base">Change Password</span>
        </button>

        <button
          onClick={handleDeleteAccount}
          className="flex-1 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <FaTrashAlt className="text-sm md:text-base" />
          <span className="text-sm md:text-base">Delete Account</span>
        </button>
      </div>

      {/* Additional info */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg">
        <p className="text-xs md:text-sm text-gray-600 text-center">
          <strong>Note:</strong> Changes to your account details may require email verification. 
          Account deletion is permanent and cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default UserActions;
