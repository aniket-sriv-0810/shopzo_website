// components/BookingCard.jsx
import React, { useState } from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel"; // Assuming this is where CancelBooking is defined

const BookingCard = ({ booking, onCancelSuccess }) => {
  const {
    _id,
    product,
    vendor,
    category,
    quantity,
    sizeSelected,
    totalPrice,
    createdAt,
    status,
  } = booking;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-6 border">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <span className="text-sm text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <img
          src={product.images[0]}
          alt="Product"
          className="w-full h-48 object-cover rounded-xl"
        />

        <div className="space-y-2 text-sm">
          <p>
            <strong>Vendor:</strong> {vendor.name}
          </p>
          <p>
            <strong>Category:</strong> {category.title}
          </p>
          <p>
            <strong>Size Selected:</strong> {sizeSelected}
          </p>
          <p>
            <strong>Quantity:</strong> {quantity}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{totalPrice}
          </p>
        </div>
      </div>

      {/* Display cancel button if booking status is not already cancelled */}
      {status !== "cancelled" && (
        <CancelBooking
          bookingId={_id}
          userId={vendor._id}  // Adjust if the userId is different
          onCancelSuccess={onCancelSuccess}
        />
      )}
    </div>
  );
};

export default BookingCard;
