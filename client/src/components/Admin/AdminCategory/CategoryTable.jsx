import React from "react";
import CategoryRow from "./CategoryRow";

const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white">
          <tr>
            <th className="px-4 py-3 border">Image</th>
            <th className="px-4 py-3 border">Title</th>
            <th className="px-4 py-3 border">Category ID</th>
            <th className="px-4 py-3 border">Tag</th>
            <th className="px-4 py-3 border">Edit</th>
            <th className="px-4 py-3 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category._id}
              category={category}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
