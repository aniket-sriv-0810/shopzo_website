import React from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel";

const BookingCard = ({ booking, userId , onCancelSuccess }) => {
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6 max-w-full transition-all hover:shadow-xl">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">{product?.title || "Product Title"}</h2>
          <p className="text-sm text-gray-500">Booked on: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full 
          ${status === "cancelled"
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-700"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Image */}
        <div className="col-span-1">
          <img
            src={product?.images?.[0] || "/fallback-image.jpg"}
            alt={product?.title || "Product Image"}
            className="rounded-xl w-full aspect-square object-cover border"
          />
        </div>

        {/* Booking Info */}
        <div className="col-span-2 grid grid-cols-2 gap-4 text-sm md:text-base text-gray-700">
          <div>
            <p><span className="font-semibold">Vendor:</span> {vendor?.name || "N/A"}</p>
            <p><span className="font-semibold">Category:</span> {product?.category?.title || "N/A"}</p>
            <p><span className="font-semibold">Size:</span> {sizeSelected || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Quantity:</span> {quantity || 1}</p>
            <p><span className="font-semibold">Price:</span> ₹{totalPrice || 0}</p>
            <p><span className="font-semibold">Vendor Email:</span> {vendor?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {status !== "cancelled" && (
        <div className="mt-6 flex justify-end">
        <CancelBooking
            bookingId={_id}
            userId={userId} // ✅ Use correct user ID here
            onCancelSuccess={onCancelSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default BookingCard;
