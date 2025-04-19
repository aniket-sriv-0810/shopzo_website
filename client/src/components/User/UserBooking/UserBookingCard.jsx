import React from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel";

const BookingCard = ({ booking, onCancelSuccess }) => {
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
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{product?.title || "N/A"}</h2>
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <img
          src={product?.images?.[0] || "/fallback-image.jpg"} // fallback image
          alt={product?.title || "Product Image"}
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="space-y-2 text-sm">
          <p>
            <strong>Vendor:</strong> {vendor?.name || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {product?.category?.title || "N/A"}
          </p>
          <p>
            <strong>Size Selected:</strong> {sizeSelected || "N/A"}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity || 1}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{totalPrice || 0}
          </p>
        </div>
      </div>

      {status !== "cancelled" && (
        <CancelBooking
          bookingId={_id}
          userId={vendor?._id} // make sure this is the correct ID
          onCancelSuccess={onCancelSuccess}
        />
      )}
    </div>
  );
};

export default BookingCard;
