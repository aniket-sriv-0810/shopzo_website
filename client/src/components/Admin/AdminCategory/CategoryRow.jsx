import React from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryRow = ({ category, onDelete }) => {
  const { _id, title, image } = category;
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/category/${_id}/delete`,
        { withCredentials: true }
      );
      onDelete(_id); // Callback to update parent state
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <tr className="border text-center text-sm">
      <td className="px-2 py-2">
        <img
          src={image || "/default-category.jpg"}
          alt={title}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{title || "N/A"}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>

      {/* Edit Button */}
      <td className="px-2 py-2">
        <button
          onClick={() => navigate(`category/${_id}/edit-category`)}
          className="text-white p-3 rounded-full bg-green-500 hover:bg-green-600 hover:cursor-pointer"
          title="Edit Category"
        >
          <FaEdit />
        </button>
      </td>

      {/* Delete Button */}
      <td className="px-2 py-2">
        <button
          onClick={handleDelete}
          className="text-white p-3 rounded-full bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          title="Delete Category"
        >
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default CategoryRow;