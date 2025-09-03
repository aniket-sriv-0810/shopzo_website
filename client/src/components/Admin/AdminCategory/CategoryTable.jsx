import React from "react";
import CategoryRow from "./CategoryRow";

const CategoryTable = ({ categories, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={2} className="px-4 py-2 border text-center">Category Details</th>
            <th className="px-4 py-2 border text-center">Tag</th>
            <th colSpan={2} className="px-4 py-2 border text-center">Actions</th>
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Edit</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <CategoryRow key={category._id} category={category} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;