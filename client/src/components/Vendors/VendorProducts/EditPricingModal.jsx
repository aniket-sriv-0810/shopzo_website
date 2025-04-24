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
    <>

<div className="fixed inset-0 p-3 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700 bg-opacity-60 backdrop-blur-sm">
  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[24rem] shadow-2xl text-white space-y-6">
    <h2 className="text-xl font-semibold text-center">Change Pricing</h2>

    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Original Price</label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 placeholder-white/70 text-white"
          placeholder="Enter original price"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Discounted Price</label>
        <input
          type="number"
          value={discountedPrice}
          onChange={(e) => setDiscountedPrice(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-md bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 placeholder-white/70 text-white"
          placeholder="Enter discounted price"
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>

    <div className="flex justify-end gap-3 pt-2">
      <button
        onClick={onClose}
        className="px-4 py-1.5 rounded-md border border-white/40 bg-white/10 hover:bg-white/20 transition text-white"
      >
        Cancel
      </button>
      <button
        onClick={handleUpdate}
        className="px-4 py-1.5 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 transition text-white font-semibold shadow-md"
      >
        Save
      </button>
    </div>
  </div>
</div>

    </>
  );
};

export default EditPricingModal;
