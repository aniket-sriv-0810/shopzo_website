import React from "react";
import VendorCategoryRow from "./VendorCategoryRow";

const VendorCategoryTable = ({ categories }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 border">Category ID</th>
            <th className="px-4 py-3 border">Title</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <VendorCategoryRow key={category._id} category={category} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorCategoryTable;
