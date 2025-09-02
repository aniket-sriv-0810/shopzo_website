import React from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel";
import { useNavigate } from "react-router-dom";
import UserDeleteCancelledBooking from "../../../pages/User/UserCancelBooking";

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
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 sm:p-7 transition hover:shadow-2xl hover:scale-[1.01] flex flex-col">
      {/* Product Image */}
      <div className="w-48 h-44 m-auto aspect-square mb-5">
        <img
          src={product?.images?.[0] || "/fallback-image.jpg"}
          alt={product?.title || "Product Not Available"}
          className="rounded-2xl w-full h-full object-cover border"
        />
      </div>

      {/* Title + Status */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {product?.title || "Product Title"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Booked on : {new Date(createdAt).toLocaleDateString("IN")}
          </p>
        </div>
        <span
          className={`mt-3 sm:mt-0 px-4 py-1.5 text-sm font-semibold rounded-full shadow-md
            ${
              status === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 gap-3 text-gray-700 mb-6">
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-900">Vendor:</span>{" "}
            {vendor?.name || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Vendor Email:</span>{" "}
            {vendor?.email || "N/A"}
          </p>
        </div>
        <div className="space-y-2">
          <p>
            <span className="font-medium text-gray-900">Category:</span>{" "}
            {product?.category?.title || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Quantity:</span>{" "}
            {quantity || 1}
          </p>
          <p>
            <span className="font-medium text-gray-900">Size:</span>{" "}
            {sizeSelected || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Price:</span>{" "}
            <span className="text-green-600 font-medium">
              ₹{(totalPrice || 0).toLocaleString("INR")}.00
            </span>
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
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
          className=" text-white bg-gradient-to-bl from-teal-700 to-green-700 hover:scale-110 hover:cursor-pointer shadow-md shadow-gray-500 px-6 py-2 rounded-xl"
        >
          View Confirmation
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
