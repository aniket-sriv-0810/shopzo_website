import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const VendorRow = ({ vendor, categories, refreshVendors }) => {
  const { name, username, _id, email, phone, address, image } = vendor;

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("male");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCategory = async () => {
    if (!selectedCategory) return setMessage("Select a category");

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors/${_id}/add-category`,
        {
          categoryId: selectedCategory,
          tag: selectedTag,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setMessage("Category added successfully!");
        refreshVendors();
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
  <td className="px-4 py-2 border">
    <img
      src={image}
      alt={name}
      className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
    />
  </td><td className="px-4 py-2 border">{name}</td>
  <td className="px-4 py-2 border">{username}</td>
  <td className="px-4 py-2 border text-xs break-all">{_id}</td>
  <td className="px-4 py-2 border">{phone}</td>
  <td className="px-4 py-2 border">{email}</td>
  <td className="px-4 py-2 border text-sm text-left">
    {address.area}, {address.city}, {address.state}, {address.country} - {address.pincode}
  </td><td className="px-4 py-2 border">
    <Link
      to={`/admin/vendors/${_id}/add-category`}
      className="w-full bg-green-600 text-white text-sm py-1 rounded hover:bg-green-700"
    >
      Add Category
    </Link>
  </td>
</tr>

  );
};

export default VendorRow;
