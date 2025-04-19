import React from "react";
import ProductRow from "./ProductRow";

const ProductTable = ({ products, refreshProducts }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-xl">
      <table className="min-w-full text-sm md:text-base border border-gray-200">
      <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-center">
  <tr>
    <th className="px-4 py-3 border" colSpan={4}>Product Details</th>
    <th className="px-4 py-3 border" colSpan={2}>Category Details</th>
    <th className="px-4 py-3 border" colSpan={3}>Vendor Details</th>
    <th className="px-4 py-3 border" colSpan={2}>Actions</th>
  </tr>
  <tr className="bg-gradient-to-b from-indigo-700 to-slate-700">
    <th className="px-3 py-2 border">Image</th>
    <th className="px-3 py-2 border">Title</th>
    <th className="px-3 py-2 border">ID</th>
    <th className="px-3 py-2 border">Price</th>
    <th className="px-3 py-2 border">Cat Image</th>
    <th className="px-3 py-2 border">Cat Title</th>
    <th className="px-3 py-2 border">Vendor Img</th>
    <th className="px-3 py-2 border">Vendor Name</th>
    <th className="px-3 py-2 border">Vendor ID</th>
    <th className="px-3 py-2 border">Edit</th>
    <th className="px-3 py-2 border">Delete</th>
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
