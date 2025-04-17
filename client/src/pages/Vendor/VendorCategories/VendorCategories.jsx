import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorCategoryTable from "../../../components/Vendors/VendorCategory/VendorCategoryTable";

const VendorCategories = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendorCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/categories-listed`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch vendor categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorCategories();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Vendor Listed Categories
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-600">No categories found for this vendor.</p>
      ) : (
        <VendorCategoryTable categories={categories} />
      )}
    </div>
  );
};

export default VendorCategories;
