import React from 'react';
import VendorBookingStatusUpdater from '../VendorPaymentStatusUpdater/VendorPaymentStatusUpdater'; // adjust path as needed
import { useUser } from '../../UserContext/userContext'; // adjust path to your user context
import { useParams } from 'react-router-dom';

const VendorBookingRow = ({ booking }) => {
    const {id} = useParams();
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

  return (
    <tr className="border text-center text-sm">
      {/* User Details */}
      <td className="px-2 py-2">{user?.name || "N/A"}</td>
      <td className="px-2 py-2">{user?.email || "N/A"}</td>
      <td className="px-2 py-2">{user?.phone || "N/A"}</td>

      {/* Product Details */}
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

      {/* Status */}
      <td className="px-2 py-2">
  <VendorBookingStatusUpdater
    vendorId={id}
    bookingId={booking?.bookingId}
    currentStatus={booking?.paymentStatus}
    onStatusUpdate={() => {}} // Optional callback if you want to refresh parent list
  />
</td>

      {/* Booking Date */}
      <td className="px-2 py-2">
        {new Date(bookingDate).toLocaleDateString("en-IN")}
      </td>

      {/* Booking ID */}
      <td className="px-2 py-2 text-xs text-gray-600">{bookingId}</td>
    </tr>
  );
};

export default VendorBookingRow;
