import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryTable from "../../components/Admin/AdminCategory/CategoryTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";
import { useNavigate } from "react-router-dom";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 📡 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/categories`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCategories(res.data.data.allCategoryDetails);
        setFilteredCategories(res.data.data.allCategoryDetails); // ✅ fixed
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch category data."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredCategories(categories); // reset if empty
      return;
    }

    const lower = query.toLowerCase();
    const filtered = categories.filter(
      (cat) =>
        (cat?.title && cat.title.toLowerCase().includes(lower)) ||
        (cat?._id && cat._id.toLowerCase().includes(lower))
    );
    setFilteredCategories(filtered);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-9">
        All Listed Categories
      </h1>

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
              navigate("/admin"); // Optional redirect
            }}
          />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Category Data Found"}
            tagline={"Oops! It looks like your category data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search categories by name or ID..."
            onSearch={handleSearch}
          />

          {/* ✅ Use filtered list */}
          <CategoryTable categories={filteredCategories} />
        </>
      )}
    </div>
  );
};

export default AdminCategory;
