import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CategoryRow = ({ category }) => {
  const { _id, title, image, tag } = category;
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>
      <td className="px-4 py-2 border font-semibold capitalize">{title}</td>
      <td className="px-4 py-2 border text-sm break-all">{_id}</td>
      <td className="px-4 py-2 border capitalize">{tag}</td>

      {/* EDIT button in its own column */}
      <td className="px-4 py-4 border">
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate(`category/${_id}/edit-category`)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-all flex items-center gap-1 text-sm"
          >
            <FaEdit className="text-xs" /> Edit
          </button>
        </div>
      </td>

      {/* DELETE button in its own column */}
      <td className="px-4 py-4 border">
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate(`category/${_id}/delete-category`)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-all flex items-center gap-1 text-sm"
          >
            <FaTrash className="text-xs" /> Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CategoryRow;
