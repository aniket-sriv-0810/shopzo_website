import React, { useState } from "react";

const ToggleGender = ({ onToggle }) => {
  const [selected, setSelected] = useState("male");

  const handleToggle = (value) => {
    setSelected(value);
    if (onToggle) onToggle(value);
  };

  return (
    <div className="w-full flex justify-center items-center py-2">
      <div className="flex bg-gray-800 rounded-full shadow-md overflow-hidden border border-gray-600 transition-all duration-300 hover:shadow-lg">
        {["male", "female"].map((gender) => (
          <button
            key={gender}
            onClick={() => handleToggle(gender)}
            className={`relative px-6 py-2 m-2 text-sm sm:text-base font-semibold transition-all duration-300 focus:outline-none rounded-full ${
              selected === gender
                ? "bg-gradient-to-tl from-fuchsia-600 to-pink-600 text-white"
                : "text-gray-200 hover:bg-gray-700"
            }`}
          >
            <span
              className={`absolute inset-0 bg-gradient-to-r ${
                selected === gender ? "from-blue-400 via-blue-500 to-blue-600" : "from-transparent to-transparent"
              } rounded-full opacity-20`}
            ></span>
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToggleGender;
