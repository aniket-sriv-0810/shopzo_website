import React from "react";
import { FaEnvelope, FaPhone, FaUser, FaIdBadge } from "react-icons/fa";

const AdminInfo = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">
        Admin Profile
      </h2>
      <div className="space-y-4 text-gray-700 text-base">
        <div className="flex items-center gap-3">
          <FaUser className="text-blue-600" />
          <span className="font-medium">Name:</span> {user.name || "N/A"}
        </div>
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-green-600" />
          <span className="font-medium">Email:</span> {user.email || "N/A"}
        </div>
        <div className="flex items-center gap-3">
          <FaPhone className="text-pink-500" />
          <span className="font-medium">Phone:</span> {user.phone || "N/A"}
        </div>
        <div className="flex items-center gap-3">
          <FaIdBadge className="text-yellow-600" />
          <span className="font-medium">User ID:</span> {user._id || "N/A"}
        </div>
      </div>
    </div>
  );
};

export default AdminInfo;
