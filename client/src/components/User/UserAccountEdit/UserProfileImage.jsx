import React from "react";

const UserProfileImage = ({ orgImage, handleImageChange }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <img
        src={orgImage || "/default-avatar.png"}
        alt="User Profile"
        className="w-32 h-32 rounded-full border-4 border-indigo-600 shadow-lg object-cover"
      />
      <label className="mt-3 text-sm font-medium text-gray-600">Change Profile Picture</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
      />
    </div>
  );
};

export default UserProfileImage;