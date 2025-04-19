import React from 'react';

const BookingRow = ({ booking }) => {
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
  } = booking;

  return (
    <tr className="border text-center text-sm">
      {/* User Details */}
      <td className="px-2 py-2">{user?.name || "N/A"}</td>
      <td className="px-2 py-2">{user?.email || "N/A"}</td>
      <td className="px-2 py-2">{user?.phone || "N/A"}</td>

      {/* Vendor Details */}
      <td className="px-2 py-2">
        <img
          src={vendor?.image || "/default-vendor.jpg"}
          alt={vendor?.name}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{vendor?.name || "N/A"}</td>
      <td className="px-2 py-2">{vendor?.phone || "N/A"}</td>

      {/* Product Details */}
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
      <td className="px-2 py-2">₹{totalPrice}</td>

      {/* Status */}
      <td className="px-2 py-2">
        <span
          className={`px-3 py-1 rounded-full text-white text-xs ${
            status === 'completed'
              ? 'bg-green-600'
              : status === 'cancelled'
              ? 'bg-red-500'
              : status === 'pending'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          {status}
        </span>
      </td>

      {/* Booking Date */}
      <td className="px-2 py-2">
        {new Date(bookingDate).toLocaleDateString("en-IN")}
      </td>

      {/* Booking ID */}
      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>
    </tr>
  );
};

export default BookingRow;
