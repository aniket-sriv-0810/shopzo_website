import React from 'react';
import BookingRow from './BookingRow';

const BookingTable = ({ bookings, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={3} className="px-4 py-2 border text-center">User Details</th>
            <th colSpan={3} className="px-4 py-2 border text-center">Vendor Details</th>
            <th colSpan={5} className="px-4 py-2 border text-center">Product Details</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Booking Date</th>
            <th className="px-4 py-2 border">Booking ID</th>
            <th className="px-4 py-2 border">Action</th> {/* Delete column */}
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>

            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Phone</th>

            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Size</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Price</th>

            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking._id} booking={booking} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
