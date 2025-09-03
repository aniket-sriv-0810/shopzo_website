import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { TbTagPlus } from 'react-icons/tb';
import axios from 'axios';

const VendorRow = ({ vendor, onDelete }) => {
  const { name, username, _id, email, phone, image } = vendor;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/vendor/${_id}/account/delete`,
        { withCredentials: true }
      );
      onDelete(_id); // Callback to update parent state
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete vendor");
    }
  };

  return (
    <tr className="border text-center text-sm">
      {/* Personal Details */}
      <td className="px-2 py-2">
        <img
          src={image || "/default-vendor.jpg"}
          alt={name}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{name || "N/A"}</td>
      <td className="px-2 py-2">{username || "N/A"}</td>

      {/* Contact Info */}
      <td className="px-2 py-2">{phone || "N/A"}</td>
      <td className="px-2 py-2">{email || "N/A"}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>

      {/* Actions */}
      <td className="px-2 py-2">
        <Link to={`/admin/vendor/${_id}/add-category`}>
          <TbTagPlus className="text-green-600 text-3xl mx-auto hover:scale-110 transition" />
        </Link>
      </td>
      <td className="px-2 py-2">
        <button
          onClick={handleDelete}
          className="text-white p-3 rounded-full bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          title="Delete Vendor"
        >
          <FaTrashAlt />
        </button>
      </td>
    </tr>
  );
};

export default VendorRow;