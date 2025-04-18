import React from 'react';
import BookingRow from './BookingRow';

const BookingTable = ({ bookings }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Vendor</th>
            <th className="px-4 py-2">Product</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Total Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Booking Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking._id} booking={booking} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
