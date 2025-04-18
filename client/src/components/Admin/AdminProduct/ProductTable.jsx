import React from "react";
import ProductRow from "./ProductRow";

const ProductTable = ({ products, refreshProducts }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 border">Image</th>
            <th className="px-4 py-3 border">Title</th>
            <th className="px-4 py-3 border">Product ID</th>
            <th className="px-4 py-3 border">Price</th>
            <th className="px-4 py-3 border">Category</th>
            <th className="px-4 py-3 border">Tag</th>
            <th className="px-4 py-3 border">Vendor</th>
            <th className="px-4 py-3 border">Edit</th>
            <th className="px-4 py-3 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product._id} product={product} refreshProducts={refreshProducts} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
