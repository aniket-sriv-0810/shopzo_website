import React from 'react';
import VendorBookingRow from './VendorBookingRow';

const VendorBookingTable = ({ bookings, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={3} className="px-4 py-2 border text-center">User Details</th>
            <th colSpan={5} className="px-4 py-2 border text-center">Product Details</th>
            <th className="px-4 py-2 border">Order Status</th>
            <th className="px-4 py-2 border">Order Date</th>
            <th className="px-4 py-2 border">Order ID</th>
            <th className="px-4 py-2 border">Delete</th> {/* NEW */}
          </tr>
          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Size</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Status</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Product ID</th>
            <th className="px-4 py-2 border">Action</th> {/* NEW */}
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <VendorBookingRow
              key={booking.bookingId}
              booking={booking}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorBookingTable;
