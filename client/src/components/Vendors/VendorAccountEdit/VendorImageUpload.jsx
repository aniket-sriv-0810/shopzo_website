import React from "react";

const VendorImageUpload = ({ orgImage, handleImageChange }) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <img
        src={orgImage || "/default-avatar.png"}
        alt="Vendor"
        className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-lg"
      />
      <label className="mt-3 text-sm font-medium text-gray-600">Change Profile Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mt-2 text-sm file:px-4 file:py-2 file:rounded-md file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
      />
    </div>
  );
};

export default VendorImageUpload;
