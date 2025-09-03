import React from 'react';
import ProductRow from './ProductRow';

const ProductTable = ({ products, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded">
      <table className="min-w-full table-auto border">
        {/* Headers */}
        <thead className="bg-gradient-to-b from-zinc-700 to-slate-700 text-white text-sm">
          <tr>
            <th colSpan={4} className="px-4 py-2 border text-center">Product Details</th>
            <th colSpan={2} className="px-4 py-2 border text-center">Category Details</th>
            <th colSpan={3} className="px-4 py-2 border text-center">Vendor Details</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>

          <tr className="bg-slate-800 text-white text-xs">
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">ID</th>

            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Title</th>

            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">ID</th>
            
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow key={product._id} product={product} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;