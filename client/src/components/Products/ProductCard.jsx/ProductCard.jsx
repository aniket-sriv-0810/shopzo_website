import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign, FaTags } from "react-icons/fa";
import ShareBtn from "../../ShareBtn/ShareBtn";
import { useUser } from "../../UserContext/userContext";
import LikeBtn from "../../LikeBtn/LikeBtn";

const ProductCard = ({ product }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  const originalPrice = product.originalPrice;
  const discountedPrice = product.discountedPrice;
  const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
console.log("product => ", product);

  return (
    <div className="hover:shadow-yellow-200 rounded-2xl shadow-md hover:shadow-2xl border  overflow-hidden transition-transform duration-300 hover:scale-[1.02] w-full sm:max-w-[350px] mx-auto flex flex-col">
      
      {/* Image Section (70%) */}
      <div className="relative h-[70%]">
        {/* Share Button */}
        <div className="absolute top-3 left-3 z-10">
          <ShareBtn
            productName={product.title}
            productLink={`${import.meta.env.VITE_API_URL}/product/${product._id}`}
          />
        </div>

        {/* Like Button */}
        <div className="absolute top-3 right-3 z-10">
          <LikeBtn
            id={user ? user._id : null}
            productId={product ? product._id : null}
          />
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-red-600 text-white px-3 py-2 rounded-full text-xs font-bold shadow-md animate-bounce">
            {discount}% OFF
          </div>
        )}

        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-[300px] object-cover bg-gray-800 transition-all duration-300"
        />
      </div>

      {/* Content Section (30%) */}
      <div className="p-4 sm:p-3 bg-gray-700 space-y-3 flex-grow flex flex-col justify-between">
        
        {/* Title */}
        <h2 className="text-xl sm:text-2xl capitalize font-bold text-white line-clamp-2">
          {product.title}
        </h2>

        {/* Price */}
        <div className="flex items-center gap-2 text-md sm:text-base">
          <span className="flex items-center text-xl text-green-300 font-bold">
            <FaRupeeSign className="" />
            {discountedPrice.toFixed(2).toLocaleString("INR")}
          </span>
          <span className="flex items-center text-gray-400 text-sm line-through">
            {originalPrice.toFixed(2).toLocaleString("INR")}
          </span>
        </div>

        {/* Category & Tag */}
        <div className="flex flex-wrap gap-2 text-xs mt-1">
          
         
        {product.category && (
  <div className="flex items-center gap-3 mt-3">
     <img
      src={product.category.image}
      alt={product.category.title}
      className="w-10 h-10  rounded-full object-cover border border-gray-200"
    />
   {product.category?.title && (
            <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-3 py-1 rounded-full font-medium">
              {product.category.title}
            </span>
          )}
          {product.tag && (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full font-medium capitalize">
              {product.tag}
            </span>
          )}
  </div>
)}
        </div>
        {product.vendor && (
  <div className="flex items-center gap-3 mt-3">
    <span className="text-gray-300 text-sm">Sold by </span>
     <img
      src={product.vendor.image}
      alt={product.vendor.name}
      className="w-8 h-8 rounded-full object-cover border border-gray-100"
    />
    <div className="text-sm  text-gray-100">{product.vendor.name}</div>
  </div>
)}
        {/* Checkout Button */}
        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="mt-1 w-[80%] mb-2 mx-auto flex justify-center items-center gap-3 bg-gradient-to-r from-red-600 to-fuchsia-600 hover:from-blue-700 hover:to-red-800 text-white font-semibold py-2 rounded-xl shadow-md transition duration-200 transform hover:scale-105 hover:cursor-pointer"
        >
          View Product
          <FaTags className="text-xl"/>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
