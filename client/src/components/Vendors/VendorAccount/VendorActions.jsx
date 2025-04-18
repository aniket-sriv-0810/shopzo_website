import React from "react";
import { FaEdit, FaLock } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const VendorActions = ({ navigate }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-8 mt-10" data-aos="fade-down">
      <button
        onClick={() => navigate("edit")}
        className="flex items-center justify-center gap-3 bg-gradient-to-t from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg shadow-md hover:scale-105 transition-all"
      >
        Edit Details <FaEdit className="text-xl" />
      </button>
      <button
        onClick={() => navigate("change-password")}
        className="flex items-center justify-center gap-3 bg-gradient-to-t from-red-500 to-orange-600 text-white py-3 px-6 rounded-lg shadow-md hover:scale-105 transition-all"
      >
        Change Password <FaLock className="text-xl" />
      </button>
    
    </div>
  );
};

export default VendorActions;
