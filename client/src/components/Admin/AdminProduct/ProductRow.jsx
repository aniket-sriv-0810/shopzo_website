import React from "react";

const ProductRow = ({ product }) => {
  const {
    _id,
    title,
    discountedPrice,
    images,
    category,
    tag,
    vendor,
  } = product;

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={images[0]}
          alt={title}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>
      <td className="px-4 py-2 border font-semibold">{title}</td>
      <td className="px-4 py-2 border text-xs break-all">{_id}</td>
      <td className="px-4 py-2 border font-medium">₹{discountedPrice}</td>
      <td className="px-4 py-2 border capitalize">
        {product.category?.title || "N/A"}
      </td>
      <td className="px-4 py-2 border capitalize">{tag}</td>
      <td className="px-4 py-2 border">
       {product.vendor.name}
      </td>
    </tr>
  );
};

export default ProductRow;
