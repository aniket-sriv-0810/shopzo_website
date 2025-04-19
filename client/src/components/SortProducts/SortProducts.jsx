import React from "react";
import { FaSortAmountDown, FaSortAmountUp, FaExchangeAlt } from "react-icons/fa";

const SortProducts = ({ sortOrder, setSortOrder, sortProducts }) => {
  return (
    <div className="flex justify-center items-center my-8">
      <div className="relative inline-block w-64">
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            sortProducts(e.target.value);
          }}
          className="appearance-none border-2 border-gray-300 bg-white py-3 pl-4 pr-14 rounded-lg shadow-xl text-gray-800 text-base sm:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer hover:border-indigo-500 transition-all duration-300 w-full hover:shadow-2xl"
        >
          <option value="default">🔽 Sort Products</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
        </select>

        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-lg transition-all duration-300">
          {sortOrder === "lowToHigh" ? (
            <FaSortAmountDown className="text-green-500 animate-bounce" />
          ) : sortOrder === "highToLow" ? (
            <FaSortAmountUp className="text-red-500 animate-bounce" />
          ) : (
            <FaExchangeAlt className="text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SortProducts;
