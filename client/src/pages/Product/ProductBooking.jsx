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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-4 py-10 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Book Your Product</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Product Info */}
          <div className="space-y-4">
            <img src={product.images[0]} alt={product.title} className="w-full h-64 object-cover rounded-xl shadow" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Category: <span className="font-semibold">{product.category?.title}</span> | Tag: <span className="capitalize">{product.tag}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Sold by: <span className="font-medium">{product.vendor.name}</span> ({product.vendor.email} | {product.vendor.phone})
              </p>
              <p className="text-sm text-gray-500">
                Address: {product.vendor.address.area}, {product.vendor.address.city}, {product.vendor.address.state} - {product.vendor.address.pincode}, {product.vendor.address.country}
              </p>
              <p className="mt-2 font-medium text-sm text-gray-800">
                Booked by: {user?.name} ({user?.email} | {user?.phone})
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleBooking} className="space-y-5">
            {/* Size Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Size</label>
              <select
                required
                value={sizeSelected}
                onChange={(e) => setSizeSelected(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Choose size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Billing Summary */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm text-gray-800">
              <p>Original Price: ₹{product.originalPrice}</p>
              <p>Discounted Price: ₹{product.discountedPrice}</p>
              <p>
                You Save: ₹{product.originalPrice - product.discountedPrice} ({calculateDiscount()}%)
              </p>
              <p className="font-semibold text-lg mt-2 text-indigo-700">
                Total: ₹{(product.discountedPrice * quantity).toFixed(2)}
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>

            {bookingStatus && (
              <p className={`text-sm text-center font-medium ${bookingStatus.includes("successful") ? "text-green-600" : "text-red-600"}`}>
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
