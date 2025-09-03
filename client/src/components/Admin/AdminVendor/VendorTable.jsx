import React from 'react';
import VendorRow from './VendorRow';

const VendorTable = ({ vendors, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={3} className="px-4 py-2 border text-center">Personal Details</th>
            <th colSpan={3} className="px-4 py-2 border text-center">Contact Info</th>
            <th colSpan={2} className="px-4 py-2 border text-center">Actions</th>
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Username</th>
            
            <th className="px-4 py-2 border">Phone</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">ID</th>
            
            <th className="px-4 py-2 border">Add Category</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>

        <tbody>
          {vendors.map((vendor) => (
            <VendorRow key={vendor._id} vendor={vendor} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;