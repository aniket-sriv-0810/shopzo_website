import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/Products/ProductCard.jsx/ProductCard";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import NotAvailable from "../Loaders/NotAvailable";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import SortProducts from "../../components/SortProducts/SortProducts";
import Pagination from "../../components/Pagination/Pagination";
import { authAxios } from "../../utils/auth";

const ShowCategory = () => {
  const { id, tag } = useParams();
  const [category, setCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [productsToShow, setProductsToShow] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("default");

  // 🆕 Pagination
  const PRODUCTS_PER_PAGE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(allProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await authAxios.get(`/api/category/${id}/${tag}/products`);
        setCategory(data.data.category);
        setAllProducts(data.data.products);
        setCurrentPage(1); // Reset page on category/tag change
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

  useEffect(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    setProductsToShow(allProducts.slice(startIndex, endIndex));
  }, [allProducts, currentPage]);

  const sortProducts = (order) => {
    const sorted = [...allProducts];
    if (order === "lowToHigh") {
      sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (order === "highToLow") {
      sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }
    setAllProducts(sorted);
    setCurrentPage(1); // Reset to first page after sort
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="bg-gray-200">
        <Navbar />
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonList />
        </div>
      ) : errorMsg ? (
        <div className="text-center mt-16 min-h-screen">
          <NotAvailable
            content="No Products Found"
            tagline="Oops! It looks like no products are found in this category. Why not explore our amazing collection?"
          />
        </div>
      ) : (
        <>
          <section className="m-auto p-3 pb-7 pt-6 bg-gray-700 min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl mt-2 sm:text-3xl font-bold text-gray-300 tracking-tight leading-tight">
                Products in <span className="text-fuchsia-500">{category?.title}</span>
              </h2>
              <p className="text-xl text-gray-300 font-semibold mt-3 capitalize">{tag}</p>
            </div>

            <SortProducts
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortProducts={sortProducts}
            />

            {productsToShow.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 transition-all duration-300">
                  {productsToShow.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center mt-10">
                <NotAvailable
                  content="No Products Available"
                  tagline="Looks like there are no products available in this category yet. Check back soon!"
                />
              </div>
            )}
          </section>
        </>
      )}

      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default ShowCategory;
