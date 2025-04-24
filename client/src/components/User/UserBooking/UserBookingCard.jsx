import React from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel";
import { useNavigate } from "react-router-dom";
import UserDeleteCancelledBooking from '../../../pages/User/UserCancelBooking';

const BookingCard = ({ booking, userId, onCancelSuccess }) => {
  const navigate = useNavigate();
  const {
    _id,
    product,
    vendor,
    quantity,
    sizeSelected,
    totalPrice,
    createdAt,
    status,
  } = booking;

  return (
    <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-4 sm:p-6 mb-6 w-full transition hover:shadow-lg">
      {/* Top section with status */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{product?.title || "Product Title"}</h2>
          <p className="text-gray-500 text-sm">Booked on: {new Date(createdAt).toLocaleDateString("IN")}</p>
        </div>
        <span className={`mt-2 sm:mt-0 w-max px-3 py-1 text-xs font-semibold rounded-full
          ${status === "cancelled" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Image + Booking Info */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Image */}
        <div className="w-full">
          <img
            src={product?.images?.[0] || "/fallback-image.jpg"}
            alt={product?.title || "Product Not Available"}
            className="rounded-xl w-full object-cover aspect-square border"
          />
        </div>

        {/* Info Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
          <div className="space-y-2">
            <p><span className="font-medium text-gray-900">Vendor:</span> {vendor?.name || "N/A"}</p>
            <p><span className="font-medium text-gray-900">Category:</span> {product?.category?.title || "N/A"}</p>
            <p><span className="font-medium text-gray-900">Size:</span> {sizeSelected || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-900">Quantity:</span> {quantity || 1}</p>
            <p><span className="font-medium text-gray-900">Price:</span> ₹{totalPrice || 0}</p>
            <p><span className="font-medium text-gray-900">Vendor Email:</span> {vendor?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        {status !== "cancelled" ? (
          <CancelBooking
            bookingId={_id}
            userId={userId}
            onCancelSuccess={onCancelSuccess}
          />
        ) : (
          <UserDeleteCancelledBooking
            bookingId={_id}
            onDeleted={() => onCancelSuccess(_id)}
          />
        )}

        <button
          onClick={() => navigate(`/booking/${_id}/confirmation`)}
          className="text-white bg-gradient-to-tr from-teal-800 to-green-600 hover:scale-105 hover:shadow-md transition px-5 py-3 hover:cursor-pointer rounded-xl text-sm sm:text-base"
        >
          View Confirmation
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
