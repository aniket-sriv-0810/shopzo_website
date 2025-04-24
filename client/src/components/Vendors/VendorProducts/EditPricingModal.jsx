import React, { useState } from "react";
import axios from "axios";

const EditPricingModal = ({ isOpen, onClose, product, vendorId, onPriceUpdate }) => {
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice);
  const [discountedPrice, setDiscountedPrice] = useState(product.discountedPrice);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    if (discountedPrice >= originalPrice) {
      setError("Discounted price must be less than original price.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/account/product/${vendorId}/${product._id}/update-prices`,
        { originalPrice, discountedPrice },
        { withCredentials: true }
      );
      onPriceUpdate();
      onClose();
    } catch (err) {
      setError("Failed to update prices.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 space-y-4">
        <h2 className="text-lg font-bold">Edit Pricing</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Original Price</label>
          <input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
            className="w-full border px-3 py-1.5 rounded-md"
          />
          <label className="block text-sm font-medium">Discounted Price</label>
          <input
            type="number"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(Number(e.target.value))}
            className="w-full border px-3 py-1.5 rounded-md"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="text-gray-600 px-4 py-1 border rounded-md hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPricingModal;
