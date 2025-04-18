import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";

const VendorRow = ({ vendor, categories, refreshVendors }) => {
  const { name, username, _id, email, phone, address, image } = vendor;

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeleteVendor = async () => {
    try {
      setDeleting(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${_id}/delete`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMessage("Deleted successfully!");
        refreshVendors();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed");
    } finally {
      setTimeout(() => {
        setMessage("");
        setDeleting(false);
      }, 2000);
    }
  };

  return (
    <tr className="hover:bg-gray-50 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>

      <td className="px-4 py-2 border">{name}</td>
      <td className="px-4 py-2 border">{username}</td>
      <td className="px-4 py-2 border text-xs break-all">{_id}</td>
      <td className="px-4 py-2 border">{phone}</td>
      <td className="px-4 py-2 border">{email}</td>
      <td className="px-4 py-2 border text-sm text-left">
        {address.area}, {address.city} - {address.pincode}
      </td>

      <td className="px-4 py-2 border">
        <Link
          to={`/admin/vendor/${_id}/add-category`}
          className="bg-green-600 text-white text-sm py-1.5 px-3 rounded-lg hover:bg-green-700 transition"
        >
          Add Category
        </Link>
      </td>

      <td className="px-4 py-2 border">
        <button
          disabled={deleting}
          onClick={handleDeleteVendor}
          className={`flex items-center justify-center mx-auto gap-2 px-4 py-1.5 text-white text-sm font-semibold rounded-lg transition
            ${deleting ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
        >
          <MdDeleteForever className="text-lg" />
          {deleting ? "Deleting..." : "Delete"}
        </button>

        {message && (
          <p className="text-xs mt-1 text-center text-red-500">{message}</p>
        )}
      </td>
    </tr>
  );
};

export default VendorRow;
