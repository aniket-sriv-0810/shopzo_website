import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonCard from "../../components/LoadingSkeleton/SkeletonCard";
import NotAvailable from "../Loaders/NotAvailable";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { FaRupeeSign } from "react-icons/fa";

const ShowProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/product/${id}`
      );
      setProduct(data.data.product); // 👈 correctly access the nested product
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10">
        <SkeletonCard />
      </div>
    );

  if (!product)
    return (
      <div className="col-span-full text-center text-lg font-semibold text-gray-700 mt-10">
        <NotAvailable
          content="No Product Found"
          tagline="Oops! Looks like this product isn't available. Explore our amazing collection!"
        />
      </div>
    );

  const originalPrice = product.originalPrice;
  const discountedPrice = product.discountedPrice;
  const discount = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Image Carousel */}
        <div className="relative w-full overflow-hidden mb-8">
          <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide">
            {product.images ? product.images.map((img, idx) => (
              <div
                key={product._id-idx}
                className="flex-shrink-0 w-full sm:w-[400px] h-[320px] sm:h-[480px] snap-start rounded-2xl overflow-hidden bg-gray-100 shadow-md"
              >
                <img
                  src={img}
                  alt={`Product ${idx}`}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )) : "No image found !"}
          </div>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            <p className="text-gray-600 text-lg">{product.description}</p>

            {/* Prices */}
            <div className="flex items-center gap-4">
            {originalPrice && discountedPrice ? (
  <div className="flex items-center gap-4">
    <div className="text-2xl font-semibold text-green-600 flex items-center">
      <FaRupeeSign className="mr-1" />
      {Number(discountedPrice).toFixed(0)}
    </div>
    <div className="line-through text-gray-500 flex items-center">
      <FaRupeeSign className="mr-1" />
      {Number(originalPrice).toFixed(0)}
    </div>
    {discount > 0 && (
      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">
        {discount}% OFF
      </span>
    )}
  </div>
) : (
  <div className="text-gray-500 italic">Price not available</div>
)}
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Sizes</h3>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <div
                    key={size}
                    className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:border-blue-500 transition"
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Category & Tag */}
            <div className="flex flex-wrap gap-3 mt-4">
              {product.category?.title && (
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                   {product.category.title}
                </span>
              )}
              {product.tag && (
                <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                   {product.tag}
                </span>
              )}
            </div>
          </div>

          {/* Vendor Info & Action */}
          <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={product.vendor?.image}
                alt="Vendor"
                className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <p className="text-sm text-gray-500">Sold by</p>
                <p className="text-lg font-semibold text-gray-800">
                  {product.vendor?.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/product/${id}/booking`)}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Proceed to Booking
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ShowProduct;
