import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaUser, FaStore, FaTruck } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import { useUser } from "../../components/UserContext/userContext";
import { authAxios } from "../../utils/auth";

const DeliveryConfirmation = () => {
  const { deliveryId } = useParams(); // ✅ deliveryId from route
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const { data } = await authAxios.get(
          `${import.meta.env.VITE_API_URL}/api/product/delivery/${deliveryId}/confirmation`,
          { withCredentials: true }
        );
        setDelivery(data.data);;
      } catch (err) {
        setError("Failed to fetch delivery details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [deliveryId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <SkeletonForm />
      </div>
    );
  }

  if (error || !delivery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-lg">{error || "Delivery not found."}</p>
      </div>
    );
  }

  const { product, vendor, status, _id, expectedDate, address } = delivery;

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-200 to-zinc-200">
        <Navbar />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-gray-100 p-4 sm:p-10">
  <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

    {/* Header */}
    <div className="bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 text-white py-10 px-6 text-center">
      <FaCheckCircle className="text-6xl mx-auto mb-4 drop-shadow-lg" />
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Delivery Confirmed</h1>
      <p className="text-sm sm:text-base mt-2">
        Delivery ID: <span className="font-semibold">{_id}</span>
      </p>
    </div>

    {/* Main Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 text-gray-800">

      {/* Product Info */}
      <div className="space-y-5">
        <h2 className="text-xl sm:text-2xl flex items-center gap-3 font-bold border-b border-gray-200 pb-2">
          <FaTruck className="text-green-600" /> Product Being Delivered
        </h2>
        <img
          src={product?.images?.[0]}
          alt={product?.title}
          className="w-full max-w-sm h-56 object-cover rounded-2xl border border-gray-200 shadow-md"
        />
        <div className="space-y-2 text-sm sm:text-base">
          <p><span className="font-semibold">Product:</span> {product?.title}</p>
          <p><span className="font-semibold">Status:</span> <span className="bg-purple-500 -mt-1 px-3 py-1 rounded-full text-white"> {status} </span></p>
          <p><span className="font-semibold">Estimated Time of Delivery:</span> <span className="text-green-600 text-lg">60 mins </span></p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-5">
        <h2 className="text-xl sm:text-2xl flex items-center gap-3 font-bold border-b border-gray-200 pb-2">
          <FaUser className="text-indigo-600" /> Customer Info
        </h2>
        <div className="space-y-2 text-sm sm:text-base">
          <p><span className="font-semibold">Name:</span> {user.name || "N/A"}</p>
          <p><span className="font-semibold">Email:</span> {user.email || "N/A"}</p>
          <p><span className="font-semibold">Phone:</span> {user.phone || "N/A"}</p>
          <p>
            <span className="font-semibold">Delivery Address:</span> <br />
            Area:{address?.buildingName} , {address?.fullAddress} <br />
            Landmark: {address?.landmark} <br />
            City: {address?.city} - {address?.pincode}
          </p>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="md:col-span-2 space-y-5">
        <h2 className="text-xl sm:text-2xl flex items-center gap-3 font-bold border-b border-gray-200 pb-2">
          <FaStore className="text-amber-600" /> Vendor Info
        </h2>
        <div className="space-y-2 text-sm sm:text-base">
          <p><span className="font-semibold">Name:</span> {vendor?.name}</p>
          <p><span className="font-semibold">Email:</span> {vendor?.email}</p>
          <p><span className="font-semibold">Phone:</span> {vendor?.phone}</p>
           <p>
                <span className="font-semibold">Address:</span>{' '}
                {vendor?.address?.area}, {vendor?.address?.city}, {vendor?.address?.state} - {vendor?.address?.pincode}, {vendor?.address?.country}
              </p>
        </div>
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 px-8 py-6 bg-gray-50 border-t">
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        <IoIosArrowBack className="text-lg" />
        Back to Home
      </Link>
    </div>
  </div>
</div>

    </>
  );
};

export default DeliveryConfirmation;
