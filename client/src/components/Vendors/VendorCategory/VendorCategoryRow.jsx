import React from "react";

const VendorCategoryRow = ({ category }) => {
  const { _id, title, image, tag } = category;

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-2 border">
        <img
          src={image}
          alt={title}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
        />
      </td>
      <td className="px-4 py-2 border font-semibold capitalize">{title}</td>
      <td className="px-4 py-2 border text-sm break-all">{_id}</td>
      <td className="px-4 py-2 border capitalize">{tag}</td>
    </tr>
  );
};

export default VendorCategoryRow;
