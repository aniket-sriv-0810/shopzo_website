import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorProductCard from "../../Vendors/VendorProductCard/VendorProductCard";
import Pagination from "../../Pagination/Pagination"; // adjust path as needed
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import NotAvailable from "../../../pages/Loaders/NotAvailable";
import Navbar from "../../Navbars/Navbar/Navbar";
import Footer from "../../Footer/Footer";
import SortProducts from "../../SortProducts/SortProducts";
const ShowVendorProducts = () => {
  const { id, categoryId, tag } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const [sortOrder, setSortOrder] = useState("default");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const fetchFilteredProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/${categoryId}/${tag}/all-products`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setProducts(res.data.products);
        setError("");
      } else {
        setError("No products found.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Error fetching products.");
    } finally {
      setLoading(false);
    }
  };
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
  useEffect(() => {
    fetchFilteredProducts();
  }, [id, categoryId, tag]);

  // Calculate pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll to top
  };

  return (
    <>
<div className="bg-gray-200">
        <Navbar />
      </div>
    <div className=" bg-gray-700 min-h-screen p-2">
    {products.length > 0 && (
      <>

  <h2 className="text-2xl sm:text-3xl font-bold text-gray-300 tracking-tight leading-tight text-center mt-10 mb-6">
    Products in <span className="text-fuchsia-500">{products[0]?.category?.title || "Unknown Category"}</span>
  </h2>
  <p className="text-xl text-gray-300 font-semibold mt-1 text-center capitalize">{products[0].tag}</p>
      </>
)}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonList />
        </div>
      ) : error ? (
        <div className="text-center mt-16 min-h-screen">
          <NotAvailable
            content="No Products Found"
            tagline="Oops! It looks like no products are found in this category. Why not explore our amazing collection?"
          />
        </div>
      ) : currentProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <>
        <div className="mt-4">

        <SortProducts
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              sortProducts={sortProducts}
            />
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {currentProducts.map((product) => (
              <VendorProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </>
      )}
      
    </div>
      <div className="">
        <Footer />
      </div>
    </>
  );
};

export default ShowVendorProducts;
