import React from "react";

const VendorProductCard = ({ product }) => {
  const {
    title,
    images,
    originalPrice,
    discountedPrice,
    category,
    tag,
    vendor,
  } = product;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all overflow-hidden">
      <img
        src={images?.[0]}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mb-2 capitalize">
          Category: {category?.title} • Tag: {tag}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 line-through text-sm">
            ₹{originalPrice}
          </span>
          <span className="text-green-600 font-bold">₹{discountedPrice}</span>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <img
            src={vendor?.image}
            alt={vendor?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm text-gray-700">{vendor?.name}</div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductCard;
