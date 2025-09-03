import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate, useLocation } from "react-router-dom";

const ReviewLoader = ({ message = "Successfully Submitted!" }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/"; // Get return path

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => navigate(returnTo), 500); // Redirect after fade-out
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, returnTo]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gradient-to-t from-gray-800 to-teal-600 bg-opacity-40 backdrop-blur-lg transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white p-5 sm:p-7 rounded-2xl shadow-xl text-center w-80 md:w-96 transition-transform transform ${
          isVisible ? "translate-y-0 scale-100" : "translate-y-10 scale-95 opacity-0"
        }`}
      >
        <DotLottieReact
          src="https://lottie.host/e080215c-f7c9-4975-89d8-8827b20e8374/lILbnOFwId.lottie"
          autoplay
          className="w-66 h-40 mb-10 m-auto"
        />

        <h2 className="text-lg font-semibold text-black -mt-4">{message}</h2>
        <p className="text-sm text-gray-500">Redirecting you shortly...</p>

        <button
          className="mt-5 bg-gradient-to-t from-teal-600 to-gray-500 text-white font-medium px-5 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          onClick={() => navigate(returnTo)}
        >
          Back to Vendor →
        </button>
      </div>
    </div>
  );
};

export default ReviewLoader;
