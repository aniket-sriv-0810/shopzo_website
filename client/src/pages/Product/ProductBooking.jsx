import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../components/UserContext/userContext";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import { FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import { BsCashCoin } from "react-icons/bs";
const ProductBooking = () => {
  const { id } = useParams(); // product ID
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [sizeSelected, setSizeSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");
  const navigate = useNavigate();
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
      const bookingId = res.data?.booking?._id || res.data?.data?.booking?._id;

      if (bookingId) {
        setBookingStatus("Booking Successful!");
        navigate(`/booking/${bookingId}/confirmation`);
      } else {
        navigate(`/product/${id}`);
      }
     } catch (err) {
      setBookingStatus(err.response?.data?.error || "Booking failed.");
    } finally {
      setLoading(false);
      setTimeout(() => setBookingStatus(""), 3000);
    }
  };

  if (!product) {
    return <div className="flex justify-center items-center py-16">
    <SkeletonForm />
  </div>;
  }

  return (
    <>
  <div className="bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
    <Navbar/>
  </div>
    <div className="min-h-screen bg-gradient-to-br from-slate-700 via-gray-500 to-zinc-800 px-4 py-10 flex justify-center items-center">
  <div className="w-full max-w-6xl bg-white rounded-3xl shadow-xl p-6 mt-5 sm:p-10">
    <h1 className="text-xl md:text-3xl sm:text-4xl font-extrabold mb-10 text-center text-gray-800">
      Book Your Product for In-Store Shopping
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
          <h2 className="text-3xl font-bold capitalize text-gray-800">{product.title}</h2>

          <p className="text-sm flex gap-3 text-gray-600">
            <span className=" font-medium flex gap-2"> Category : {product.category?.title} </span> |{" "}
            <span className="font-medium">Tag :</span> <span className="capitalize">{product.tag}</span>
          </p>

          <div className="text-sm  text-gray-600 space-y-1">
            <p>
              <span className="font-medium ">Sold by :</span> {product.vendor.name} (
               <span className="px-1">{product.vendor.email}  | {product.vendor.phone}) </span>
            </p>
            <p>
              <span className="font-medium ">Address:</span>{" "}
              {product.vendor.address.area}, {product.vendor.address.city}{" "}- {product.vendor.address.pincode},{" "}
            </p>
          </div>

          <p className="text-sm font-medium text-teal-600">
            👤 Booked by:  {user?.name} ({user?.email} | {user?.phone})
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
              className="w-9 h-9 border pb-1 border-red-500 font-bold bg-gray-200 hover:bg-red-400 hover:text-white hover:cursor-pointer text-xl rounded-full "
            >
              −
            </button>
            <span className="text-lg font-semibold ">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-9 h-9 border pb-1 border-green-500 bg-gray-200 hover:bg-green-400 hover:text-white hover:cursor-pointer text-xl rounded-full"
            >
              +
            </button>
          </div>
        </div>

        {/* Billing Summary */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 rounded-2xl shadow-md space-y-3 transition-all duration-300">
  <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
    🧾 Billing Summary
  </h3>

  <div className="flex justify-between text-sm text-gray-700">
    <span>Original Price</span>
    <span className=" text-gray-600">₹{product.originalPrice}</span>
  </div>

  <div className="flex justify-between text-sm text-gray-700">
    <span>Discount</span>
    <span className="text-green-500 font-bold">- ₹{ Math.abs(product.originalPrice - product.discountedPrice)}</span>
  </div>
  <div className="flex justify-between text-sm text-gray-700">
    <span>Offer Price</span>
    <span className="text-teal-600 font-medium">₹{product.discountedPrice}</span>
  </div>

  <div className="flex justify-between  text-sm text-gray-700">
    <span>You Save</span>
    <span className="text-green-600 font-semibold">
      ₹{product.originalPrice - product.discountedPrice} ({calculateDiscount()}%)
    </span>
  </div>

  <hr className="my-2 border-t" />

  <div className="flex justify-between text-lg font-semibold text-green-600">
    <span className="text-gray-500">Total Amount Payable</span>
    <span className="text-xl font-bold">₹ {(product.discountedPrice * quantity).toLocaleString("INR")}</span>
  </div>
</div>


        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 hover:cursor-pointer hover:scale-105 bg-gradient-to-b from-green-400 to-teal-500 text-white font-semibold rounded-xl transition-all duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Booking..." : " Confirm Booking"}
        </button>

      </form>
    </div>
  </div>
</div>
    </>
  );
};

export default ProductBooking;
