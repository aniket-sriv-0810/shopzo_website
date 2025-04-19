import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../components/UserContext/userContext";

const ProductBooking = () => {
  const { id } = useParams(); // product ID
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [sizeSelected, setSizeSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/product/${id}`);
        console.log(res.data);
        
        setProduct(res.data.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const calculateDiscount = () => {
    if (!product) return 0;
    return Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!sizeSelected || quantity < 1) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/${id}/booking`,
        { sizeSelected, quantity },
        { withCredentials: true }
      );
      setBookingStatus("Booking Successful!");
    } catch (err) {
      setBookingStatus(err.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
      setTimeout(() => setBookingStatus(""), 3000);
    }
  };

  if (!product) {
    return <div className="text-center py-10 text-gray-600">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 px-4 py-10 flex justify-center items-center">
  <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6 sm:p-10">
    <h1 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center text-gray-800">
      📦 Book Your Product
    </h1>

    <div className="grid lg:grid-cols-2 gap-12 items-start">
      {/* Product Info */}
      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl shadow-md">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-72 sm:h-80 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {product.category?.title} |{" "}
            <span className="font-medium">Tag:</span> <span className="capitalize">{product.tag}</span>
          </p>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Sold by:</span> {product.vendor.name} (
              {product.vendor.email} | {product.vendor.phone})
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {product.vendor.address.area}, {product.vendor.address.city},{" "}
              {product.vendor.address.state} - {product.vendor.address.pincode},{" "}
              {product.vendor.address.country}
            </p>
          </div>

          <p className="text-sm font-medium text-indigo-700">
            👤 Booked by: {user?.name} ({user?.email} | {user?.phone})
          </p>
        </div>
      </div>

      {/* Booking Form */}
      <form
        onSubmit={handleBooking}
        className="space-y-6 bg-gray-50 rounded-2xl shadow-inner p-6 sm:p-8 border"
      >
        {/* Size */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Size
          </label>
          <select
            required
            value={sizeSelected}
            onChange={(e) => setSizeSelected(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          >
            <option value="">Choose a size</option>
            {product.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="w-9 h-9 bg-gray-200 hover:bg-gray-300 text-xl rounded-full"
            >
              −
            </button>
            <span className="text-lg font-semibold">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-9 h-9 bg-gray-200 hover:bg-gray-300 text-xl rounded-full"
            >
              +
            </button>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-sm space-y-1">
          <p>Original Price: ₹{product.originalPrice}</p>
          <p>Discounted Price: ₹{product.discountedPrice}</p>
          <p>
            You Save: ₹{product.originalPrice - product.discountedPrice} (
            {calculateDiscount()}%)
          </p>
          <p className="font-bold text-lg text-indigo-600 pt-2">
            Total: ₹{(product.discountedPrice * quantity).toFixed(2)}
          </p>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Booking..." : "🎉 Confirm Booking"}
        </button>

        {/* Booking Status */}
        {bookingStatus && (
          <p
            className={`text-sm text-center font-medium ${
              bookingStatus.includes("successful") ? "text-green-600" : "text-red-600"
            }`}
          >
            {bookingStatus}
          </p>
        )}
      </form>
    </div>
  </div>
</div>

  );
};

export default ProductBooking;
