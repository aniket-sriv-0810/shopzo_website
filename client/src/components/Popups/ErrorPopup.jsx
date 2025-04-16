import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";

const ErrorPopup = ({
  message = "Oops! Something went wrong.",
  redirectPath = "/",
  duration = 4000,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (redirectPath) navigate(redirectPath);
        onClose();
      }, 2000);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose, redirectPath, navigate]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-t from-gray-800 to-red-600 bg-opacity-40 backdrop-blur-lg transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-6 sm:p-8 rounded-2xl shadow-2xl text-center w-80 md:w-96 transition-transform transform ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-95 opacity-0"
        }`}
      >
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <MdErrorOutline className="text-red-500 text-[80px] animate-pulse drop-shadow-md" />
        </div>

        {/* Error Message */}
        <h2 className="text-lg font-bold text-red-600">Something Went Wrong!</h2>
        <p className="text-sm text-gray-500 mt-1">{message}</p>
        <p className="text-xs text-gray-400 mt-1 italic">Please try again or contact support.</p>

        {/* CTA Button */}
        <button
          className="mt-5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              if (redirectPath) navigate(redirectPath);
              onClose();
            }, 300);
          }}
        >
          Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
