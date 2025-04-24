import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaTags } from "react-icons/fa";
import VendorLikeBtn from '../../LikeBtn/VendorLikeBtn';
import ShareBtn from "../../ShareBtn/ShareBtn";
import ReviewCount from "../../Review/ReviewCount";

const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 w-full h-full max-w-xs mx-auto group hover:shadow-gray-300">
      {/* Image Section - 60% height */}
      <div className="relative  overflow-hidden">
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
        <div className="absolute bottom-4 left-1/4  transform -translate-x-1/2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-5 py-2 text-xs font-semibold uppercase rounded-full shadow-lg animate-bounce">
         Our Best Seller
        </div>

        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 bg-gray-800"
        />
      </div>

      {/* Info Section - 40% */}
      <div className="p-5 space-y-2.5 bg-gray-100 ">
        {/* Name */}
        <h3 className="text-2xl font-bold text-center text-gray-900">{vendor.name}
        </h3>
        <div className="flex justify-center items-center mr-5 -mt-2">
        <ReviewCount id={vendor._id}/>
        </div>

        {/* Phone */}
        <div className="flex items-center text-gray-600 text-sm gap-3">
          <FaPhoneAlt className="text-green-500" />
          <span>{vendor.phone}</span>
        </div>

        {/* Email */}
        <div className="flex items-center text-gray-600 text-sm gap-3">
          <FaEnvelope className="text-blue-500" />
          <span>{vendor.email}</span>
        </div>

        {/* Address */}
        <div className="flex items-start text-gray-700 text-sm  gap-3 capitalize">
          <FaMapMarkerAlt className="text-red-500 mt-1" />
          <span>
            {vendor.address.area}, {vendor.address.city} - {vendor.address.pincode}
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            to={`/vendor/${vendor._id}/details`}
            className="w-full inline-flex items-center justify-center gap-3 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-fuchsia-600 rounded-full  hover:from-red-600 hover:to-pink-500 transition duration-300"
          >
            View Products
            <FaTags className="text-white text-lg"/>
          </Link>
        </div>  
      </div>
    </div>
  );
};

export default VendorCard;
