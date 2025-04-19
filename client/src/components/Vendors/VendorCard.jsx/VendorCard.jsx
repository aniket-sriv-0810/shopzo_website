import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";
import VendorLikeBtn from '../../LikeBtn/VendorLikeBtn';
import ShareBtn from "../../ShareBtn/ShareBtn";

const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full max-w-md mx-auto group">
      {/* Image Section - 60% height */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Share Button */}
        <div className="absolute top-3 left-3 z-10">
          <ShareBtn
            productName={vendor.name}
            productLink={`${import.meta.env.VITE_API_URL}/vendor/${vendor._id}`}
          />
        </div>

        {/* Like Button */}
        <div className="absolute top-3 right-3 z-10">
        <VendorLikeBtn vendorId={vendor?._id} />
        </div>

        {/* Best Seller Tag */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-5 py-2 text-xs font-semibold uppercase rounded-full shadow-lg animate-bounce">
          Best Seller
        </div>

        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-gray-100"
        />
      </div>

      {/* Info Section - 40% */}
      <div className="p-5 space-y-3">
        {/* Name */}
        <h3 className="text-2xl font-bold text-center text-gray-900">{vendor.name}</h3>

        {/* Phone */}
        <div className="flex items-center text-gray-700 text-sm gap-2">
          <FaPhoneAlt className="text-green-500" />
          <span>{vendor.phone}</span>
        </div>

        {/* Email */}
        <div className="flex items-center text-gray-700 text-sm gap-2">
          <FaEnvelope className="text-blue-500" />
          <span>{vendor.email}</span>
        </div>

        {/* Address */}
        <div className="flex items-start text-gray-700 text-sm gap-2">
          <FaMapMarkerAlt className="text-red-500 mt-1" />
          <span>
            {vendor.address.area}, {vendor.address.city}, {vendor.address.state} - {vendor.address.pincode}, {vendor.address.country}
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            to={`/vendor/${vendor._id}/details`}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-fuchsia-600 rounded-full  hover:from-red-600 hover:to-indigo-500 transition duration-300"
          >
            View Products
          </Link>
        </div>  
      </div>
    </div>
  );
};

export default VendorCard;
