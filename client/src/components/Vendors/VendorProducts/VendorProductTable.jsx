import React from "react";
import VendorProductRow from "./VendorProductRow";

const VendorProductTable = ({ products }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 border">Image</th>
            <th className="px-4 py-3 border">Title</th>
            <th className="px-4 py-3 border">Discounted Price</th>
            <th className="px-4 py-3 border">Original Price</th>
            <th className="px-4 py-3 border">Sizes</th>
            <th className="px-4 py-3 border">Category</th>
            <th className="px-4 py-3 border">Tag</th>
            <th className="px-4 py-3 border">Product ID</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <VendorProductRow key={product._id} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VendorProductTable;
