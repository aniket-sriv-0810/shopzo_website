import React from "react";
import CancelBooking from "../../../pages/User/UserBookingCancel";
import { useNavigate } from "react-router-dom";

const BookingCard = ({ booking, userId , onCancelSuccess }) => {
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-300 shadow-gray-400 p-4 md:p-6 mb-6 max-w-full transition-all hover:shadow-xl">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl capitalize md:text-xl font-semibold text-gray-800">{product?.title || "Product Title"}</h2>
          <p className=" text-gray-500">Booked on: {new Date(createdAt).toLocaleDateString("IN")}</p>
        </div>
        <span className={`px-4 py-2 text-xs font-semibold rounded-full 
          ${status === "cancelled"
            ? "bg-red-500 text-white"
            : "bg-green-500 text-white"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Image */}
        <div className="col-span-1">
          <img
            src={product?.images?.[0] || "/fallback-image.jpg"}
            alt={product?.title || "Product Not Available anymore"}
            className="rounded-xl  w-full aspect-square object-cover border"
          />
        </div>

        {/* Booking Info */}
        <div className="col-span-2 grid grid-cols-2 gap-4 space-y-2 text-sm md:text-base text-gray-700">
          <div>
            <p><span className="font-semibold p-2 m-2">Vendor:</span> {vendor?.name || "N/A"}</p>
            <p><span className="font-semibold p-2 m-2">Category:</span> {product?.category?.title || "N/A"}</p>
            <p><span className="font-semibold p-2 m-2">Size:</span> {sizeSelected || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold p-2 m-2">Quantity:</span> {quantity || 1}</p>
            <p><span className="font-semibold p-2 m-2">Price:</span> ₹{totalPrice || 0}</p>
            <p><span className="font-semibold p-2 m-2">Vendor Email:</span> {vendor?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {status !== "cancelled" && (
        <div className="mt-6 flex justify-end ">
        <CancelBooking
            bookingId={_id}
            userId={userId} // ✅ Use correct user ID here
            onCancelSuccess={onCancelSuccess}
          />
        </div>
      )}
      <div className=" mt-6  ">
      <button
        onClick={() =>  navigate(`/booking/${_id}/confirmation`)}
        className=" text-white bg-gradient-to-bl from-indigo-500 to-fuchsia-600 hover:scale-110 hover:cursor-pointer shadow-md shadow-gray-500 px-5 py-2 rounded"
      >
        View Confirmation
      </button>
    </div>
    </div>
  );
};

export default BookingCard;
