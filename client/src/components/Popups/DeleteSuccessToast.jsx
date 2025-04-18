import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DeleteSuccessToast = ({ message = "Successfully deleted!",  redirectPath = "/admin",  onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
    const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate(redirectPath)
        if (onClose) onClose();
      }, 300); // delay for animation fade-out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-50 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center gap-4 bg-white border border-green-300 shadow-lg rounded-xl px-4 py-3 min-w-[280px] max-w-xs animate-slide-in">
        <FaCheckCircle className="text-green-500 text-3xl animate-bounce" />
        <div>
          <h4 className="text-sm font-semibold text-green-700">{message}</h4>
          <p className="text-xs text-gray-500">Your action was successful.</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuccessToast;
