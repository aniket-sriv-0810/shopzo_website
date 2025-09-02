import React from "react";
import logo from "../.../../../assets/black-website-logo.png";

const MainLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center justify-center">
        
        
        {/* Black Logo Highlighted with White BG + Glow */}
        <div className="flex flex-col justify-center items-center gap-4">

        <div className="relative flex items-center justify-center w-48 h-48 rounded-full shadow-xl shadow-slate-300/50 border-3 border-red-500 animate-pulse">
          <img
            src={logo}
            alt="Company Logo"
            className="w-48 h-48 object-contain"
          />
        </div>
        <p className="capitalize text-xl text-center font-semibold text-gray-900 animate-pulse py-2">
           Please Wait Loading...
          </p>
        </div>
      </div>

    </div>
  );
};

export default MainLoader;
