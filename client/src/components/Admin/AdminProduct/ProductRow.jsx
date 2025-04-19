import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const ProductRow = ({ product, refreshProducts }) => {
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/product/${product._id}/delete`,
        { withCredentials: true }
      );
  
      // Optional: console the whole response to debug it
      console.log("Delete response:", response);
  
      if (response.status === 200 || response.status === 204) {
        setMessage("Deleted!");
        refreshProducts(); // only refresh if successful
      } else {
        throw new Error("Unexpected response status: " + response.status);
      }
    } catch (error) {
      console.error("Delete error:", error);
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
      {/* Col 1 - Product Details */}
      <td className="px-2 py-3 border">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-12 h-12 object-cover rounded-full mx-auto border  shadow-md shadow-gray-300"
        />
      </td>
      <td className="px-3 py-3 border font-semibold">{product.title}</td>
      <td className="px-3 py-3 border text-xs break-all text-gray-500">{product._id}</td>
      <td className="px-3 py-3 border font-medium text-green-700">₹{(product.discountedPrice)}</td>

      {/* Col 2 - Category */}
      <td className="px-3 py-3 border">
        <img
          src={product.category?.image || "https://via.placeholder.com/50"}
          alt="Category"
          className="w-12 h-12 object-cover rounded-full mx-auto border shadow-md shadow-gray-300"
        />
      </td>
      <td className="px-2 py-3 border">{product.category?.title || "N/A"}</td>

      {/* Col 3 - Vendor */}
      <td className="px-2 py-3 border">
        <img
          src={product.vendor?.image || "https://via.placeholder.com/50"}
          alt="Vendor"
          className="w-12 h-12 object-cover rounded-full mx-auto border  shadow-md shadow-gray-300"
        />
      </td>
      <td className="px-2 py-3 border">{product.vendor?.name || "N/A"}</td>
      <td className="px-2 py-3 border text-xs break-all text-gray-500">{product.vendor?._id || "N/A"}</td>

      {/* Edit Button */}
      <td className="px-2 py-3 border">
        <button
          onClick={() => navigate(`/admin/product/${product._id}/edit`)}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2 mx-auto"
        >
          <FaEdit /> Edit
        </button>
      </td>

      {/* Delete Button */}
      <td className="px-2 py-3 border">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`px-3 py-1 text-white text-sm rounded-md flex items-center gap-2 mx-auto ${
            deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          <MdDeleteForever /> {deleting ? "Deleting..." : "Delete"}
        </button>
        {message && <p className="text-xs text-red-500 mt-1">{message}</p>}
      </td>
    </tr>
  );
};

export default ProductRow;
