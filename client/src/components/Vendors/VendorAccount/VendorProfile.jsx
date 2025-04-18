import React from "react";

const VendorProfile = ({ vendor }) => {
  return (
    <div className="w-full lg:w-1/3 bg-gradient-to-br from-fuchsia-600 to-indigo-700 text-white flex flex-col justify-center items-center p-8 shadow-md">
      <div className="text-center space-y-3" data-aos="fade-down">
        <img
          src={vendor?.image || "/placeholder.jpg"}
          alt={vendor?.name || "Vendor"}
          className="w-28 h-28 rounded-full mx-auto border-4 border-white shadow-lg object-cover bg-gray-100"
        />
        <h1 className="text-2xl font-bold uppercase">{vendor?.name || "Vendor Name"}</h1>
        <p className="text-sm font-semibold opacity-80">@{vendor?.username || "Vendor Email"}</p>
        <p className="text-sm opacity-80">{vendor?.email || "Vendor Email"}</p>
      </div>
    </div>
  );
};

export default VendorProfile;
