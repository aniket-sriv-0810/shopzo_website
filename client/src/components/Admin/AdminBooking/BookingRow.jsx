import React from 'react';

const BookingRow = ({ booking }) => {
  const {
    user,
    vendor,
    product,
    category,
    quantity,
    totalPrice,
    status,
    bookingDate,
  } = booking;

  return (
    <tr className="border-b text-center">
      <td className="px-4 py-2 capitalize">{user?.name}</td>
      <td className="px-4 py-2 capitalize">{vendor?.name}</td>
      <td className="px-4 py-2 capitalize">{product?.title}</td>
      <td className="px-4 py-2 capitalize">{category?.title}</td>
      <td className="px-4 py-2">{quantity}</td>
      <td className="px-4 py-2">₹{totalPrice}</td>
      <td className="px-4 py-2 capitalize">
        <span
          className={`px-4 py-2 rounded-full text-white text-sm ${
            status === 'completed'
              ? 'bg-green-600'
              : status === 'cancelled'
              ? 'bg-red-500'
              : status === 'confirmed'
              ? 'bg-blue-500'
              : 'bg-amber-500'
          }`}
        >
          {status}
        </span>
      </td>
      <td className="px-4 py-2">
        {new Date(bookingDate).toLocaleDateString("IN")}
      </td>
    </tr>
  );
};

export default BookingRow;
