import React from "react";
import logo from "../.../../../assets/black-website-logo.png";

const MainLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center justify-center">
        {/* Animated expanding rings with smooth opacity */}
        <div className="absolute w-60 h-60 rounded-full border-4 border-fuchsia-500 animate-ping opacity-70"></div>
        <div className="absolute w-72 h-72 rounded-full border-4 border-purple-500 animate-ping opacity-50 delay-150"></div>
        <div className="absolute w-84 h-84 rounded-full border-4 border-indigo-300 animate-ping opacity-30 delay-300"></div>

        {/* Black Logo Highlighted with White BG + Glow */}
        <div className="flex flex-col justify-center items-center gap-4">

        <div className="relative flex items-center justify-center w-48 h-48 rounded-full shadow-xl shadow-slate-300/50 border-3 border-pink-500 animate-pulse">
          <img
            src={logo}
            alt="Company Logo"
            className="w-48 h-48 object-contain"
          />
        </div>
        <p className="capitalize text-xl text-center font-bold text-gray-900 animate-pulse py-2">
           Please Wait Loading...
          </p>
        </div>
      </div>

    </div>
  );
};

export default MainLoader;
