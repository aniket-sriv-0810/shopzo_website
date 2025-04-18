import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDownload } from "react-icons/md";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-600">Loading booking confirmation...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-red-600">{error || "Booking not found"}</p>
      </div>
    );
  }

  const {
    product,
    user,
    vendor,
    category,
    sizeSelected,
    quantity,
    totalPrice,
    status,
    bookingDate,
    _id,
  } = booking;

  const percentageSaved = Math.round(
    ((product.originalPrice - product.discountedPrice) /
      product.originalPrice) *
      100
  );
  const totalOriginalPrice = product.originalPrice * quantity;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-12 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <FaCheckCircle className="text-green-500 text-5xl" />
          <h1 className="text-3xl font-bold text-gray-800">
            Booking Confirmed!
          </h1>
          <p className="text-sm text-gray-500">
            Booking ID: <span className="font-semibold">{_id}</span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
          {/* Product Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Product</h2>
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-32 h-32 object-cover rounded-xl shadow"
            />
            <p><strong>Title:</strong> {product.title}</p>
            <p><strong>Category:</strong> {category.title}</p>
            <p><strong>Tag:</strong> {product.tag}</p>
            <p><strong>Size:</strong> {sizeSelected}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
          </div>

          {/* Billing Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Bill Summary</h2>
            <p><strong>Original Price:</strong> ₹{product.originalPrice}</p>
            <p><strong>Discounted Price:</strong> ₹{product.discountedPrice}</p>
            <p><strong>You Save:</strong> ₹{product.originalPrice - product.discountedPrice} ({percentageSaved}%)</p>
            <p><strong>Total Before Discount:</strong> ₹{totalOriginalPrice}</p>
            <p className="text-xl font-bold"><strong>Total Payable:</strong> ₹{totalPrice}</p>
          </div>

          {/* User Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Booked By</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>

          {/* Vendor Section */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Sold By</h2>
            <p><strong>Name:</strong> {vendor.name}</p>
            <p><strong>Email:</strong> {vendor.email}</p>
            <p><strong>Phone:</strong> {vendor.phone}</p>
            <p>
              <strong>Address:</strong>{" "}
              {vendor.address.area}, {vendor.address.city}, {vendor.address.state} - {vendor.address.pincode}, {vendor.address.country}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between flex-wrap gap-4 mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
          >
            <IoIosArrowBack /> Back to Home
          </Link>

          <button className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all">
            <MdDownload /> Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
