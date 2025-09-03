import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

const DeliveryRow = ({ delivery, onDelete }) => {
  const {
    _id,
    user,
    vendor,
    product,
    sizeSelected,
    quantity,
    totalPrice,
    status,
    bookingDate,
    address, // Destructure the address object
  } = delivery;

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/deliveries/${_id}`,
        { withCredentials: true }
      );
      onDelete(_id);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete delivery");
    }
  };

  return (
    <tr className="border text-center text-sm">
      <td className="px-2 py-2">{user?.name || "N/A"}</td>
      <td className="px-2 py-2">{user?.email || "N/A"}</td>
      <td className="px-2 py-2">{user?.phone || "N/A"}</td>

      <td className="px-2 py-2">
        <img
          src={vendor?.image || "/default-vendor.jpg"}
          alt={vendor?.name}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{vendor?.name || "N/A"}</td>
      <td className="px-2 py-2">{vendor?.phone || "N/A"}</td>

      <td className="px-2 py-2">
        <img
          src={product?.images?.[0] || "/default-product.jpg"}
          alt={product?.title}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      </td>
      <td className="px-2 py-2">{product?.title || "N/A"}</td>
      <td className="px-2 py-2">{sizeSelected || "N/A"}</td>
      <td className="px-2 py-2">{quantity}</td>
      <td className="px-2 py-2 text-green-500 font-medium">₹{totalPrice}</td>

      {/* New cells for address details */}
      <td className="px-2 py-2 text-sm text-left">{address?.fullAddress || "N/A"}</td>
      <td className="px-2 py-2">{address?.city || "N/A"}</td>
      <td className="px-2 py-2">{address?.pincode || "N/A"}</td>

      <td className="px-2 py-2">
        <span className={`px-3 py-1 rounded-full text-white text-xs ${
          status === 'completed'
            ? 'bg-green-600'
            : status === 'cancelled'
            ? 'bg-red-500'
            : status === 'pending'
            ? 'bg-yellow-500'
            : 'bg-blue-500'
        }`}>
          {status}
        </span>
      </td>

      <td className="px-2 py-2">
        {new Date(bookingDate).toLocaleDateString("en-IN")}
      </td>

      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>

      {/* Delete Column */}
      <td className="px-2 py-2">
        {(status === "cancelled" || status === "completed" || status === "pending") && (
          <button
            onClick={handleDelete}
            className="text-white p-3 rounded-full bg-red-500 hover:bg-red-600 hover:cursor-pointer"
            title="Delete Delivery"
          >
            <FaTrashAlt />
          </button>
        )}
      </td>
    </tr>
  );
};

export default DeliveryRow;