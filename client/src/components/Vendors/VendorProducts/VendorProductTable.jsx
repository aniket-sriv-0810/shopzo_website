import React from "react";
import VendorProductRow from "./VendorProductRow";

const VendorProductTable = ({ products, vendorId, onPriceUpdate }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={7} className="px-4 py-2 border text-center">Product Details</th>
            <th colSpan={2} className="px-4 py-2 border text-center">Actions & IDs</th>
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Discounted Price</th>
            <th className="px-4 py-2 border">Original Price</th>
            <th className="px-4 py-2 border">Sizes</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Tag</th>
            <th className="px-4 py-2 border">Product ID</th>
            <th className="px-4 py-2 border">Edit Pricing</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <VendorProductRow
              key={product._id}
              product={product}
              vendorId={vendorId}
              onPriceUpdate={onPriceUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorProductTable;
