import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "../../components/Admin/AdminProduct/ProductTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setProducts(res.data.data.allProductDetails);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-9">
        All Products Listed
      </h1>

      {loading ? (
        <div className='flex justify-center items-center mt-10'>
      <SkeletonTable/> 
        </div>
      ) :  error ? (
        <div className="text-center text-red-600 font-medium"><ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin"); // Optional: redirect or reload logic
            }}
          /></div>
      )  : products.length === 0 ? (
        <div className="text-center text-gray-600 font-medium"><AdminNotAvailableLoader content={"No Products data Found"} tagline={" Oops! It looks like your product data is empty"}/></div>
      ): (
        <ProductTable products={products} refreshProducts={fetchProducts} />
      )}
    </div>
  );
};

export default AdminProduct;
