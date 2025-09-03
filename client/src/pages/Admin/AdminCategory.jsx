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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 📡 Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/categories`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCategories(res.data.data.allCategoryDetails);
        setFilteredCategories(res.data.data.allCategoryDetails);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch category data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ❌ Delete Handler
  const handleDeleteCategory = (deletedId) => {
    setCategories((prev) => prev.filter((category) => category._id !== deletedId));
    setFilteredCategories((prev) =>
      prev.filter((category) => category._id !== deletedId)
    );
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredCategories(categories);
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

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">
        All Listed Categories
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

          <CategoryTable
            categories={filteredCategories}
            onDelete={handleDeleteCategory}
          />
        </>
      )}
    </div>
  );
};

export default AdminCategory;