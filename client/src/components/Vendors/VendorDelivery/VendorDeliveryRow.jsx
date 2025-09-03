import React from 'react';
import { useParams } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import VendorDeliveryStatusUpdater from './VendorDeliveryStatusUpdater';
import axios from 'axios';

const VendorDeliveryRow = ({ delivery, onDelete }) => {
  const { id } = useParams();

  const {
    deliveryId,
    orderDate,
    paymentStatus,
    totalPrice,
    sizeSelected,
    quantity,
    user,
    product,
    address, // Destructure the address object
  } = delivery;

  const handleDelete = async () => {
    if (!["cancelled", "delivered"].includes(paymentStatus)) {
      console.error("Only cancelled or delivered orders can be deleted.");
      return;
    }

    // In a real-world app, replace this with a custom modal for user confirmation.
    console.log("Confirming deletion for delivery:", deliveryId);

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/deliveries/${deliveryId}/${user?._id}/${product?._id}`,
        { withCredentials: true }
      );
      onDelete(deliveryId);
    } catch (error) {
      console.error("Delete failed:", error);
      console.error("Failed to delete delivery.");
    }
  };

  return (
    <tr className="border text-center text-sm">
      <td className="px-2 py-2">{user?.name || "N/A"}</td>
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

      {/* Cells for address details */}
      <td className="px-2 py-2 text-sm text-center">{address?.buildingName || "N/A"}</td>
      <td className="px-2 py-2 text-sm text-center">{address?.fullAddress || "N/A"}</td>
      <td className="px-2 py-2 text-sm text-center">{address?.landmark || "N/A"}</td>
      <td className="px-2 py-2 text-sm text-center">{address?.city || "N/A"}</td>
      <td className="px-2 py-2 text-sm text-center">{address?.pincode || "N/A"}</td>


      <td className="px-2 py-2">
        <VendorDeliveryStatusUpdater
          vendorId={id}
          deliveryId={deliveryId}
          currentStatus={paymentStatus}
          onStatusUpdate={() => {}}
        />
      </td>

      <td className="px-2 py-2">
        {new Date(orderDate).toLocaleDateString("en-IN")}
      </td>
      <td className="px-2 py-2 text-xs text-gray-600">{deliveryId}</td>

      {/* Delete Column */}
      <td className="px-3 py-3 mx-2 rounded-full flex justify-center items-center mt-2 bg-red-500 text-white cursor-pointer hover:bg-red-600" onClick={handleDelete}>
        <FaTrashAlt />
      </td>
    </tr>
  );
};

export default VendorDeliveryRow;
