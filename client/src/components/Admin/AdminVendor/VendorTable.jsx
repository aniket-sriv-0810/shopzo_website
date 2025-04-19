import React from "react";
import VendorRow from "./VendorRow";

const VendorTable = ({ vendors, categories, refreshVendors , deleteVendor}) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white">
          <tr>
            <th className="px-4 py-3 border">Image</th>
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Username</th>
            <th className="px-4 py-3 border">Vendor ID</th>
            <th className="px-4 py-3 border">Phone</th>
            <th className="px-4 py-3 border">Email</th>
            <th className="px-4 py-3 border">Address</th>
            <th className="px-4 py-3 border">Add Category</th>
            <th className="px-4 py-3 border">Delete</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {vendors.map((vendor) => (
            <VendorRow
  key={vendor._id}
  vendor={vendor}
  categories={categories}
  refreshVendors={refreshVendors}
  deleteVendor={deleteVendor} // ✅ add this!
/>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorTable;
