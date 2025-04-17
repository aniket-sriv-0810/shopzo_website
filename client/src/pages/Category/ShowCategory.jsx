import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/Products/ProductCard.jsx/ProductCard";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import NotAvailable from "../Loaders/NotAvailable";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const ShowCategory = () => {
  const { id, tag } = useParams();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/category/${id}/${tag}/products`,
          { withCredentials: true }
        );
        setCategory(data.data.category);
        setProducts(data.data.products);
        setErrorMsg("");
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMsg(error.response?.data?.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    if (id && tag) {
      fetchProducts();
    }
  }, [id, tag]);

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <Navbar />
      </div>

      <section className="max-w-7xl mx-auto px-6 py-10 bg-yellow-100 shadow-lg rounded-lg mt-10 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <SkeletonList />
          </div>
        ) : errorMsg ? (
          <div className="text-center mt-16">
            <NotAvailable 
              content="No Products Found" 
              tagline="Oops! It looks like no products are found in this category. Why not explore our amazing collection?"
            />
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-semibold text-gray-800 tracking-tight leading-tight">
                Products in <span className="text-indigo-600">{category?.title}</span>
              </h2>
              <p className="text-xl text-gray-500 mt-2 capitalize">For {tag}</p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10 transition-all duration-300">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center mt-10">
                <NotAvailable 
                  content="No Products Available" 
                  tagline="Looks like there are no products available in this category yet. Check back soon!"
                />
              </div>
            )}
          </>
        )}
      </section>

      <div className="mt-16">
        <Footer />
      </div>
    </>
  );
};

export default ShowCategory;
