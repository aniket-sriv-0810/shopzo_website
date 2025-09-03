import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "../../components/Admin/AdminProduct/ProductTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/products`,
        { withCredentials: true }
      );
      setProducts(res.data.data.allProductDetails);
      setFilteredProducts(res.data.data.allProductDetails); // ✅ keep copy
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch product data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ❌ Delete Handler
  const handleDeleteProduct = (deletedId) => {
    setProducts((prev) => prev.filter((product) => product._id !== deletedId));
    setFilteredProducts((prev) =>
      prev.filter((product) => product._id !== deletedId)
    );
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredProducts(products); // reset
      return;
    }

    const lower = query.toLowerCase();
    const filtered = products.filter(
      (p) =>
        (p?.title && p.title.toLowerCase().includes(lower)) ||
        (p?._id && p._id.toLowerCase().includes(lower))
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">
        All Products Listed
      </h2>
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonTable />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">
          <ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin");
            }}
          />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Products data Found"}
            tagline={"Oops! It looks like your product data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search products by ID, title, or vendor name..."
            onSearch={handleSearch}
          />
          <ProductTable
            products={filteredProducts}
            onDelete={handleDeleteProduct}
          />
        </>
      )}
    </div>
  );
};

export default AdminProduct;