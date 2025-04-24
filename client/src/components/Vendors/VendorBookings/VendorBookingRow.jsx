import React from 'react';
import { useParams } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import VendorBookingStatusUpdater from '../VendorPaymentStatusUpdater/VendorPaymentStatusUpdater';
import axios from 'axios';

const VendorBookingRow = ({ booking, onDelete }) => {
  const { id: vendorId } = useParams();

  const {
    bookingId,
    bookingDate,
    paymentStatus,
    totalPrice,
    sizeSelected,
    quantity,
    user,
    product,
  } = booking;

  const handleDelete = async () => {
    if (!["cancelled", "completed"].includes(paymentStatus)) {
      alert("Only cancelled or completed bookings can be deleted.");
      return;
    }

    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/bookings/${bookingId}/${user?._id}/${product?._id}`,
        { withCredentials: true }
      );
      onDelete(bookingId);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete booking.");
    }
  };

  return (
    <tr className="border text-center text-sm">
      <td className="px-2 py-2">{user?.name  || "N/A"}</td>
      <td className="px-2 py-2">{user?.email || "N/A"}</td>
      <td className="px-2 py-2">{user?.phone || "N/A"}</td>

      <td className="px-2 py-2">
        <img
          src={product?.image || "/default-product.jpg"}
          alt={product?.title}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      </td>
      <td className="px-2 py-2">{product?.title || "N/A"}</td>
      <td className="px-2 py-2">{sizeSelected || "N/A"}</td>
      <td className="px-2 py-2">{quantity}</td>
      <td className="px-2 py-2">₹{totalPrice}</td>

      <td className="px-2 py-2">
        <VendorBookingStatusUpdater
          vendorId={vendorId}
          bookingId={bookingId}
          currentStatus={paymentStatus}
          onStatusUpdate={() => {}}
        />
      </td>

      <td className="px-2 py-2">
        {new Date(bookingDate).toLocaleDateString("en-IN")}
      </td>
      <td className="px-2 py-2 text-xs text-gray-600">{bookingId}</td>

      {/* Delete Column */}
      <td className="px-2 py-2 text-red-500 cursor-pointer hover:text-red-700">
        <FaTrashAlt onClick={handleDelete} />
      </td>
    </tr>
  );
};

export default VendorBookingRow;
