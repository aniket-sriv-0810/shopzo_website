import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorProductTable from "../../../components/Vendors/VendorProducts/VendorProductTable";

const VendorProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendorProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/products-listed`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setProducts(res.data.products);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorProducts();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Vendor Listed Products
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <VendorProductTable products={products} />
      )}
    </div>
  );
};

export default VendorProducts;
