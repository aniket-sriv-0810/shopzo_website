import React from "react";

const UserProfile = ({ user }) => {
  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-zinc-800 to-zinc-700 text-white flex flex-col justify-center items-center p-8 shadow-md">
      <div className="text-center space-y-6" data-aos="fade-down">
        <img
          src={user?.image || "/placeholder.jpg"}
          alt={user?.name || "User"}
          className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg object-cover bg-gray-100"
        />
        <h1 className="text-2xl font-bold uppercase">{user?.name || "User Name"}</h1>
        <p className="text-sm opacity-80">{user?.email || "User Email"}</p>
      </div>
    </div>
  );
};

export default UserProfile;
