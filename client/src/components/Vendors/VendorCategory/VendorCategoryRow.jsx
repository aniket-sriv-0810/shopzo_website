import React from "react";

const VendorCategoryRow = ({ category }) => {
  const { _id, title } = category;

  return (
    <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
      <td className="px-4 py-3 border text-xs break-all">{_id}</td>
      <td className="px-4 py-3 border font-semibold">{title}</td>
    </tr>
  );
};

export default VendorCategoryRow;
