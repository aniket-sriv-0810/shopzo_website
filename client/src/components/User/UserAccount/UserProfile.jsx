import React from "react";
import { FaUser } from "react-icons/fa";

const UserProfile = ({ user }) => {
  if (!user) {
    return (
      <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-6 md:p-8 lg:p-10 text-white flex flex-col items-center justify-center min-h-[300px] lg:min-h-[calc(100vh-64px)]">
        <div className="animate-pulse">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full mb-4"></div>
          <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-6 md:p-8 lg:p-10 text-white flex flex-col items-center justify-center min-h-[300px] lg:min-h-[calc(100vh-64px)]">
      <div className="text-center">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-4 md:mb-6 border-4 border-white shadow-lg object-cover"
          />
        ) : (
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full mx-auto mb-4 md:mb-6 border-4 border-white shadow-lg flex items-center justify-center">
            <FaUser className="text-3xl md:text-4xl text-white/80" />
          </div>
        )}
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 break-words">
          {user.name || "User"}
        </h1>
        <p className="text-sm md:text-base lg:text-lg opacity-90 break-all">
          {user.email || "No email provided"}
        </p>
        {user.phone && (
          <p className="text-sm md:text-base opacity-80 mt-2">
            {user.phone}
          </p>
        )}
        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white/10 rounded-lg backdrop-blur-sm">
          <p className="text-xs md:text-sm opacity-75">Member since</p>
          <p className="text-sm md:text-base font-semibold">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
