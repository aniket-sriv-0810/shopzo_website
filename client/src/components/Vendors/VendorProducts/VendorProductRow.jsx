import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditPricingModal from "./EditPricingModal";

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
      <tr className="border text-center text-sm">
        <td className="px-2 py-2">
          <img
            src={images?.[0] || "/placeholder-image.jpg"}
            alt={title}
            className="w-10 h-10 object-cover rounded-full mx-auto"
          />
        </td>
        <td className="px-2 py-2">{title || "N/A"}</td>
        <td className="px-2 py-2 text-green-600 font-semibold">
          ₹{discountedPrice || "N/A"}
        </td>
        <td className="px-2 py-2 line-through text-gray-500">
          ₹{originalPrice || "N/A"}
        </td>
        <td className="px-2 py-2">
          {sizes?.length > 0 ? sizes.join(", ") : "N/A"}
        </td>
        <td className="px-2 py-2 capitalize">{category?.title || "N/A"}</td>
        <td className="px-2 py-2 capitalize">{tag || "N/A"}</td>
        <td className="px-2 py-2 text-xs text-gray-600 break-all">{_id}</td>
        <td className="px-2 py-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-white p-3 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110"
            title="Edit Pricing"
          >
            <FaEdit className="text-white" />
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
