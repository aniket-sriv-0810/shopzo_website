import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditPricingModal from "./EditPricingModal"; // new component

const VendorProductRow = ({ product, vendorId, onPriceUpdate }) => {
  const {
    title,
    images,
    sizes,
    discountedPrice,
    originalPrice,
    category,
    tag,
    _id,
  } = product;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-100 text-center text-gray-900 transition-all">
        <td className="px-4 py-2 border">
          <img
            src={images[0]}
            alt={title}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full mx-auto object-cover border border-gray-300"
          />
        </td>
        <td className="px-4 py-2 border font-semibold capitalize">{title}</td>
        <td className="px-4 py-2 border font-medium">₹{discountedPrice}</td>
        <td className="px-4 py-2 border line-through font-medium">₹{originalPrice}</td>
        <td className="px-4 py-2 border">
          {sizes?.length > 0 ? sizes.join(", ") : "N/A"}
        </td>
        <td className="px-4 py-2 border capitalize">{category?.title || "N/A"}</td>
        <td className="px-4 py-2 border capitalize">{tag}</td>
        <td className="px-4 py-2 border text-xs break-all">{_id}</td>
        <td className="px-4 py-2 border">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 hover:text-blue-800"
            title="Edit Pricing"
          >
            <FaEdit />
          </button>
        </td>
      </tr>

      {isModalOpen && (
        <EditPricingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
          vendorId={vendorId}
          onPriceUpdate={onPriceUpdate}
        />
      )}
    </>
  );
};

export default VendorProductRow;
