import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorFilteredCard from "../../../components/Vendors/VendorProductCard/VendorProductCard";

const VendorFilteredProducts = () => {
  const { id, categoryId, tag } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFilteredProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/${categoryId}/${tag}/all-products`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setProducts(res.data.products);
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

  useEffect(() => {
    fetchFilteredProducts();
  }, [id, categoryId, tag]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Filtered Products for Vendor
      </h1>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <VendorFilteredCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorFilteredProducts;
