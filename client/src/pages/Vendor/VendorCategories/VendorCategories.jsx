import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import VendorCategoryTable from "../../../components/Vendors/VendorCategory/VendorCategoryTable";
import SkeletonTable from "../../../components/LoadingSkeleton/SkeletonTable";
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import AdminSearchBar from "../../../components/Admin/AdminSearchBar/AdminSearchBar";

const VendorCategories = () => {
  const { id } = useParams(); // vendorId from URL
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVendorCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/account/categories-listed`,
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.categories) {
        setCategories(res.data.categories);
        setFilteredCategories(res.data.categories);
      } else {
        setError("No categories found.");
      }
    } catch (err) {
      console.error("Error fetching vendor categories:", err);
      setError(
        err.response?.data?.message || "Unable to fetch vendor category data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredCategories(categories);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = categories.filter(
      (c) =>
        c.title?.toLowerCase().includes(lower) ||
        c._id?.toLowerCase().includes(lower)
    );
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    fetchVendorCategories();
  }, [id]);

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <VendorNavbar />
      </div>

      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Categories Listed
        </h1>

        {loading ? (
          <div className="flex justify-center items-center mt-10">
            <SkeletonTable />
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-medium">{error}</p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-center text-gray-600">No categories found.</p>
        ) : (
          <>
            <AdminSearchBar
              placeholder="Search categories by name or ID..."
              onSearch={handleSearch}
            />
            <VendorCategoryTable categories={filteredCategories} />
          </>
        )}
      </div>
    </>
  );
};

export default VendorCategories;