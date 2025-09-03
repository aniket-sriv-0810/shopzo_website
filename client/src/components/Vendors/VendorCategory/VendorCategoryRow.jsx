import React from "react";

const VendorCategoryRow = ({ category }) => {
  const { _id, title, image,tag } = category;

  return (
    <tr className="border text-center text-sm">
      <td className="px-2 py-2">
        <img
          src={image}
          alt={title}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      </td>
      <td className="px-2 py-2">{title || "N/A"}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{_id}</td>
      <td className="px-2 py-2 text-xs text-gray-600">{tag}</td>
    </tr>
  );
};

export default VendorCategoryRow;