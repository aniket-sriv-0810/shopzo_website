import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const AdminSearchBar = ({ placeholder = "Search by name or ID...", onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="w-full flex justify-center mb-8">
      <div className="relative w-full max-w-xl">
        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full py-3.5 pl-5 pr-14 text-base sm:text-lg text-gray-800 placeholder-gray-400 
          bg-white/70 backdrop-blur-md border border-gray-300 rounded-3xl shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 
          transition-all duration-300"
        />

        {/* Search Icon Button */}
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 
          bg-gray-700 hover:bg-indigo-700 text-white p-2.5 rounded-full shadow-md 
          transition-all duration-300"
        >
          <FaSearch size={18} />
        </button>
      </div>
    </div>
  );
};

export default AdminSearchBar;
