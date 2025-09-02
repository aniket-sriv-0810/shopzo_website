import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../components/UserContext/userContext";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import { BsCashCoin } from "react-icons/bs";
import { FaTruck } from "react-icons/fa";

const ProductDelivery = () => {
  const { id } = useParams(); // product ID
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [sizeSelected, setSizeSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("");

  // Address state
  const [address, setAddress] = useState({
    houseNo: "",
    floorNo: "",
    buildingName: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
    city: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/product/${id}`
        );
        setProduct(res.data.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const calculateDiscount = useMemo(() => {
    return () => {
      if (!product) return 0;
      return Math.round(
        ((product.originalPrice - product.discountedPrice) /
          product.originalPrice) *
          100
      );
    };
  }, [product]);

  const totalAmount = useMemo(() => {
    if (!product) return 0;
    return product.discountedPrice * quantity;
  }, [product, quantity]);

  // Basic client-side validation
  const validate = () => {
    const e = {};
    if (!sizeSelected) e.sizeSelected = "Please choose a size.";
    if (quantity < 1) e.quantity = "Quantity must be at least 1.";

    if (!address.buildingName?.trim())
      e.buildingName = "Building/Apartment name is required.";
    if (!address.fullAddress?.trim())
      e.fullAddress = "Full address is required.";
    if (!address.landmark?.trim()) e.landmark = "Please add a nearby landmark.";
    if (!address.city?.trim()) e.city = "City is required.";
    if (!/^\d{6}$/.test(address.pincode || "")) {
      e.pincode = "Enter a valid 6-digit pincode.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      // Keep the same API, add delivery details alongside existing fields
      const payload = {
        sizeSelected,
        quantity,
        delivery: {
          type: "home", // for backend clarity (optional)
          houseNo: address.houseNo || undefined,
          floorNo: address.floorNo || undefined,
          buildingName: address.buildingName,
          fullAddress: address.fullAddress,
          landmark: address.landmark,
          pincode: address.pincode,
          city: address.city,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/product/${id}/delivery`,
        {
          product: id,
          sizeSelected,
          quantity,
          address,
        },
        { withCredentials: true }
      );

      const deliveryId = res.data?.data?._id;
      if (deliveryId) {
        navigate(`/delivery/${deliveryId}/confirmation`);
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
    return (
      <div className="flex justify-center items-center py-16">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100">
        <Navbar />
      </div>

      <div className="min-h-screen bg-white px-4 py-10 flex justify-center items-center">
        <div className="w-full max-w-6xl  rounded-3xl  p-6 mt-5 sm:p-10">
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs sm:text-sm bg-gray-50">
              <FaTruck className="text-gray-700" />
              <span className="font-semibold tracking-wide uppercase">
                Home Delivery
              </span>
            </div>
            <h1 className="text-xl md:text-3xl sm:text-4xl font-extrabold text-center text-gray-800">
              Get it Delivered to Your Doorstep
            </h1>
            {bookingStatus && (
              <p className="text-sm text-teal-600 font-medium">
                {bookingStatus}
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-1 gap-12 items-start mt-6">
            {/* Product Info */}
            <div className=" md:flex gap-10 justify-center items-center space-y-6">
              <div className="overflow-hidden rounded-2xl shadow-md">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className=" w-60 h-60 sm:h-60 object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold capitalize text-gray-800">
                  {product.title}
                </h2>

                <p className="text-sm flex flex-wrap gap-x-3 gap-y-1 text-gray-600">
                  <span className="font-medium">
                    Category: {product.category?.title}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="font-medium">Tag:</span>{" "}
                  <span className="capitalize">{product.tag}</span>
                </p>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Sold by:</span>{" "}
                    {product.vendor.name} (
                    <span className="px-1">
                      {product.vendor.email} | {product.vendor.phone}
                    </span>
                    )
                  </p>
                  <p>
                    <span className="font-medium">Store Address:</span>{" "}
                    {product.vendor.address.area}, {product.vendor.address.city}{" "}
                    - {product.vendor.address.pincode}
                  </p>
                </div>

                <p className="text-sm font-medium text-teal-600">
                  👤 Ordering as: {user?.name} ({user?.email} | {user?.phone})
                </p>
              </div>
            </div>

            {/* Booking + Address Form */}
            <form
              onSubmit={handleBooking}
              className=" m-auto w-full lg:w-2xl space-y-6 bg-gray-50 rounded-2xl shadow-inner p-6 sm:p-8 border"
            >
              {/* Size */}
              <div>
                <label className="block text-sm text-center font-semibold text-gray-700 mb-2">
                  Select Size
                </label>
                <select
                  required
                  value={sizeSelected}
                  onChange={(e) => setSizeSelected(e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm ${
                    errors.sizeSelected ? "border-red-400" : "border-gray-300"
                  }`}
                >
                  <option value="">Choose a size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.sizeSelected && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.sizeSelected}
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="text-center block text-sm font-semibold text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex justify-center items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-9 h-9 border pb-1 border-red-500 font-bold bg-gray-200 hover:bg-red-400 hover:text-white hover:cursor-pointer text-xl rounded-full "
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="w-9 h-9 border pb-1 border-green-500 bg-gray-200 hover:bg-green-400 hover:text-white hover:cursor-pointer text-xl rounded-full"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {errors.quantity && (
                  <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                )}
              </div>

              {/* Address Section */}
              <div className="bg-white/70 border border-gray-200 p-5 rounded-2xl shadow">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                  🏡 Delivery Address
                </h3>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Optional fields */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      House No. (optional)
                    </label>
                    <input
                      type="text"
                      value={address.houseNo}
                      onChange={(e) => handleChange("houseNo", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="e.g., 12B"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Floor No. (optional)
                    </label>
                    <input
                      type="text"
                      value={address.floorNo}
                      onChange={(e) => handleChange("floorNo", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      placeholder="e.g., 3rd"
                    />
                  </div>

                  {/* Required fields */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Building / Apartment Name{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address.buildingName}
                      onChange={(e) =>
                        handleChange("buildingName", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                        errors.buildingName
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Skyline Residency"
                    />
                    {errors.buildingName && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.buildingName}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Full Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={address.fullAddress}
                      onChange={(e) =>
                        handleChange("fullAddress", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                        errors.fullAddress
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                      placeholder="House/Street/Area"
                    />
                    {errors.fullAddress && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.fullAddress}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Landmark Nearby <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address.landmark}
                      onChange={(e) => handleChange("landmark", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                        errors.landmark ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="e.g., Near City Mall"
                    />
                    {errors.landmark && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.landmark}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                        errors.city ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="e.g., Lucknow"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) =>
                        handleChange(
                          "pincode",
                          e.target.value.replace(/[^\d]/g, "").slice(0, 6)
                        )
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                        errors.pincode ? "border-red-400" : "border-gray-300"
                      }`}
                      placeholder="6-digit code"
                    />
                    {errors.pincode && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Billing Summary */}
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-100 p-6 rounded-2xl shadow-md space-y-3 transition-all duration-300">
                <h3 className="text-base font-semibold text-gray-800 border-b pb-2">
                  🧾 Billing Summary
                </h3>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Original Price</span>
                  <span className="text-gray-600">
                    ₹{product.originalPrice}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Discount</span>
                  <span className="text-green-500 font-bold">
                    - ₹
                    {Math.abs(product.originalPrice - product.discountedPrice)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>Offer Price</span>
                  <span className="text-teal-600 font-medium">
                    ₹{product.discountedPrice}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                  <span>You Save</span>
                  <span className="text-green-600 font-semibold">
                    ₹{product.originalPrice - product.discountedPrice} (
                    {calculateDiscount()}%)
                  </span>
                </div>

                <hr className="my-2 border-t" />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-gray-500">Total Amount Payable</span>
                  <span className="text-xl text-green-500 font-bold">
                    ₹ {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                  <BsCashCoin /> Cash/UPI available during delivery.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 hover:cursor-pointer hover:scale-[1.02] bg-gradient-to-b from-green-500 to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Placing Order..." : "Confirm Home Delivery"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDelivery;
