import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDownload } from "react-icons/md";
import { useUser } from "../../components/UserContext/userContext";
const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user} = useUser();
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/navigation/${bookingId}/confirmation`,
          { withCredentials: true }
        );
        setBooking(data.data.booking);
      } catch (err) {
        setError("Failed to fetch booking details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-lg">{error || "Booking not found."}</p>
      </div>
    );
  }

  const {
    product,
    vendor,
    quantity,
    totalPrice,
    _id,
    sizeSelected,
  } = booking;

  const originalPrice = product?.originalPrice || 0;
  const discountedPrice = product?.discountedPrice || 0;
  const percentageSaved =
    originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;
  const totalOriginalPrice = originalPrice * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-gray-100 p-4 sm:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6 text-center">
          <FaCheckCircle className="text-4xl mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Booking Confirmed</h1>
          <p className="text-sm">Booking ID: <span className="font-semibold">{_id}</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8 text-sm text-gray-800">
          {/* Product Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-1">Product Details</h2>
            <img
              src={product?.images?.[0]}
              alt={product?.title}
              className="w-full max-w-xs h-48 object-cover rounded-xl shadow"
            />
            <p><strong>Title:</strong> {product?.title}</p>
            <p><strong>Category:</strong> {product?.category?.title}</p>
            <p><strong>Tag:</strong> {product?.tag}</p>
            <p><strong>Size:</strong> {sizeSelected}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
          </div>

          {/* Billing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-1">Billing Summary</h2>
            <p><strong>Original Price:</strong> ₹{originalPrice}</p>
            <p><strong>Discounted Price:</strong> ₹{discountedPrice}</p>
            <p>
              <strong>You Save:</strong> ₹{originalPrice - discountedPrice} (
              {percentageSaved}%)
            </p>
            <p><strong>Total Before Discount:</strong> ₹{totalOriginalPrice}</p>
            <p className="text-xl font-bold text-indigo-600">
              Total Payable: ₹{totalPrice}
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-1">Customer Info</h2>
            <p><strong>Name:</strong> {user.name || "N/A"}</p>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
          </div>

          {/* Vendor Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b pb-1">Sold By</h2>
            <p><strong>Name:</strong> {vendor?.name}</p>
            <p><strong>Email:</strong> {vendor?.email}</p>
            <p><strong>Phone:</strong> {vendor?.phone}</p>
            <p>
              <strong>Address:</strong>{" "}
              {vendor?.address?.area}, {vendor?.address?.city},{" "}
              {vendor?.address?.state} - {vendor?.address?.pincode},{" "}
              {vendor?.address?.country}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-gray-50 border-t">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            <IoIosArrowBack /> Back to Home
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
