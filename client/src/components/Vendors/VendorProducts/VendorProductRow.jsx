import React from "react";

const VendorProductRow = ({ product }) => {
  const {
    title,
    images,
    originalPrice,
    discountedPrice,
    tag,
    category,
  } = product;

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={images?.[0]}
          alt={title}
          className="w-12 h-12 rounded-full object-cover mx-auto"
        />
      </td>
      <td className="px-4 py-2 border font-semibold">{title}</td>
      <td className="px-4 py-2 border">
        <div className="line-through text-sm text-gray-500">
          ₹{originalPrice}
        </div>
        <div className="text-green-600 font-semibold">
          ₹{discountedPrice}
        </div>
      </td>
      <td className="px-4 py-2 border capitalize">{category?.title}</td>
      <td className="px-4 py-2 border capitalize">{tag}</td>
    </tr>
  );
};

export default VendorProductRow;
