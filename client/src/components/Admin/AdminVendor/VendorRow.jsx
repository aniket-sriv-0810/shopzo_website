import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import { TbTagPlus } from "react-icons/tb";
const VendorRow = ({ vendor, categories, refreshVendors, deleteVendor }) => {
  const { name, username, _id, email, phone, address, image } = vendor;

  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDeleteVendor = async () => {
    try {
      setDeleting(true);
      await deleteVendor(_id); // Call the delete function passed as a prop
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
    className="flex justify-center items-center"
  >
    <TbTagPlus className="text-green-600  text-3xl rounded-full hover:scale-110"/>
  </Link>
</td>


      <td className="px-4 py-2 border">
        <button
          disabled={deleting}
          onClick={handleDeleteVendor}
          className={`flex items-center hover:cursor-pointer justify-center mx-auto gap-2 px-4 py-1.5 text-white text-sm font-semibold rounded-lg transition
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
