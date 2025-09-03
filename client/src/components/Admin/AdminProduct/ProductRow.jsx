import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const ProductRow = ({ product, onDelete }) => {
  const {
    _id,
    images,
    title,
    discountedPrice,
    category,
    vendor,
  } = product;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/product/${_id}/delete`,
        { withCredentials: true }
      );
      onDelete(_id); // Callback to update parent state
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <tr className="border text-center text-sm">
      {/* Product Details */}
      <td className="px-2 py-2">
        <img
          src={images?.[0] || "/default-product.jpg"}
          alt={title}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      </td>
      <td className="px-2 py-2">{title || "N/A"}</td>
      <td className="px-2 py-2 text-green-500 font-medium">₹{discountedPrice}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>

      {/* Category Details */}
      <td className="px-2 py-2">
        <img
          src={category?.image || "/default-category.jpg"}
          alt={category?.title}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{category?.title || "N/A"}</td>

      {/* Vendor Details */}
      <td className="px-2 py-2">
        <img
          src={vendor?.image || "/default-vendor.jpg"}
          alt={vendor?.name}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{vendor?.name || "N/A"}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{vendor?._id || "N/A"}</td>

      {/* Delete Column */}
      <td className="px-2 py-2">
        <button
          onClick={handleDelete}
          className="text-white p-3 rounded-full bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          title="Delete Product"
        >
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default ProductRow;