import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductTable from "../../components/Admin/AdminProduct/ProductTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Products (Admin View)
      </h1>

      {loading ? (
        <div className='flex justify-center items-center mt-10'>
      <SkeletonTable/> 
        </div>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
};

export default AdminProduct;
