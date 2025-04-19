import React from "react";

const Pagination = ({ totalPages, currentPage, handlePageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center flex-wrap gap-3 py-6">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-4 py-2 rounded-full border transition duration-300 text-sm font-medium ${
            index + 1 === currentPage
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:text-indigo-600"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
