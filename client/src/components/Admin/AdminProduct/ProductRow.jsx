import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const ProductRow = ({ product, refreshProducts }) => {
  const {
    _id,
    title,
    discountedPrice,
    images,
    category,
    tag,
    vendor,
  } = product;

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/product/${_id}/delete`,
        { withCredentials: true }
      );
      setMessage("Deleted!");
      refreshProducts();
    } catch (error) {
      setMessage("Failed to delete");
    } finally {
      setTimeout(() => {
        setDeleting(false);
        setMessage("");
      }, 2000);
    }
  };

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={images[0]}
          alt={title}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>

      <td className="px-4 py-2 border font-semibold">{title}</td>
      <td className="px-4 py-2 border text-xs break-all">{_id}</td>
      <td className="px-4 py-2 border font-medium">₹{discountedPrice}</td>
      <td className="px-4 py-2 border capitalize">{category?.title || "N/A"}</td>
      <td className="px-4 py-2 border capitalize">{tag}</td>
      <td className="px-4 py-2 border">{vendor?.name}</td>

      {/* Edit */}
      <td className="px-4 py-2 border">
        <button
          onClick={() => navigate(`/admin/product/${_id}/edit`)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2 mx-auto"
        >
          <FaEdit /> Edit
        </button>
      </td>

      {/* Delete */}
      <td className="px-4 py-2 border">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`px-3 py-1 text-white text-sm rounded-md flex items-center gap-2 mx-auto ${
            deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <MdDeleteForever /> {deleting ? "Deleting..." : "Delete"}
        </button>
        {message && (
          <p className="text-xs text-red-500 mt-1">{message}</p>
        )}
      </td>
    </tr>
  );
};

export default ProductRow;
