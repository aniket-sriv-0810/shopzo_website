import React from "react";
import VendorCategoryRow from "./VendorCategoryRow";

const VendorCategoryTable = ({ categories }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={4} className="px-4 py-2 text-center border">Category Details</th>
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Category ID</th>
            <th className="px-4 py-2 border">Tag</th>
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