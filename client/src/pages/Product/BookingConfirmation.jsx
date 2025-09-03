import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTags, FaUser , FaRegCreditCard, FaStore  } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { MdDownload } from "react-icons/md";
import { useUser } from "../../components/UserContext/userContext";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import Navbar from "../../components/Navbars/Navbar/Navbar";
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
      <div className="flex justify-center items-center py-16">
      <SkeletonForm />
    </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-lg">{error || "Order not found."}</p>
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
    <>
 <div className="bg-gradient-to-tl from-gray-200 to-zinc-200">
      <Navbar />
    </div>
    
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-gray-100 p-4 sm:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-green-500 via-teal-500 to-green-600 text-white py-8 px-6 text-center">
          <FaCheckCircle className="text-5xl mx-auto mb-3" />
          <h1 className="text-3xl font-bold">Order Confirmed</h1>
          <p className="text-sm mt-1">Order ID: <span className="font-semibold">{_id}</span></p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 text-base text-gray-800">

          {/* Product Info */}
          <div className="space-y-5">
            <h2 className="text-2xl flex gap-3 font-bold border-b pb-2"><FaTags className="mt-1"/> Product Details</h2>
            <img
              src={product?.images?.[0]}
              alt={product?.title}
              className="w-full max-w-sm border border-gray-300 h-52 object-cover rounded-xl shadow-md"
            />
            <div className="space-y-1">
              <p><strong>Product :</strong> {product?.title}</p>
              <p><strong>Category:</strong> {product?.category?.title}</p>
              <p><strong>Tag:</strong> {product?.tag}</p>
              <p><strong>Size:</strong> {sizeSelected}</p>
              <p><strong>Quantity:</strong> {quantity}</p>
            </div>
          </div>

          {/* Billing Info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold border-b flex gap-3 pb-2"><FaRegCreditCard className="mt-1"/>  Billing Summary</h2>
            <div className="space-y-1 px-2 py-2">
              <p className="p-1"><strong>Original Price:</strong> ₹{originalPrice}</p>
              <p className="p-1"><strong>Offer Price:</strong> ₹{discountedPrice}</p>
              <p className="p-1"><strong>You Save:</strong> ₹{originalPrice - discountedPrice} ({percentageSaved}%)</p>
              <p className="p-1"><strong>Total Before Discount:</strong> ₹{totalOriginalPrice}</p>
              <p className="text-2xl font-semibold py-2 text-green-600">
                Total Payable: ₹{(totalPrice).toLocaleString("INR")}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="space-y-5">
            <h2 className="text-2xl flex gap-3  font-bold border-b pb-2"><FaUser className="mt-1"/> Customer Info</h2>
            <div className="space-y-1">
              <p><strong>Name:</strong> {user.name || "N/A"}</p>
              <p><strong>Email:</strong> {user.email || "N/A"}</p>
              <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
            </div>
          </div>

          {/* Vendor Info */}
          <div className="space-y-5">
            <h2 className="text-2xl font-bold border-b flex gap-3 pb-2"><FaStore className="mt-1"/> Vendor Info</h2>
            <div className="space-y-1">
              <p><strong>Name:</strong> {vendor?.name}</p>
              <p><strong>Email:</strong> {vendor?.email}</p>
              <p><strong>Phone:</strong> {vendor?.phone}</p>
              <p>
                <strong>Address:</strong>{' '}
                {vendor?.address?.area}, {vendor?.address?.city}, {vendor?.address?.state} - {vendor?.address?.pincode}, {vendor?.address?.country}
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-6 bg-gray-100 border-t">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            <IoIosArrowBack className="text-lg" />
            Back to Home
          </Link>
          {/* Add more actions here if needed */}
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingConfirmation;
