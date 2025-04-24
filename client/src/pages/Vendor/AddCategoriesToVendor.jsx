import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonCard from "../../components/LoadingSkeleton/SkeletonCard";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
const AddCategoryToVendor = () => {
  const { vendorId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
        setCategories(res.data?.data?.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategories((prev) =>
      e.target.checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/vendor/${vendorId}/add-categories`,
        { categoryIds: selectedCategories },
        { withCredentials: true }
      );
      setMessage("✅ Categories added successfully!");
      navigate('/admin/vendors')
    } catch (err) {
      setMessage("❌ Failed to add categories.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 flex items-center justify-center px-4 py-10">
    <div className="w-full max-w-3xl bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-10 border border-white/30 transition-all duration-500">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-wide drop-shadow-sm">
        Add Categories to Vendor
      </h2>
  
      {message && (
        <p className="text-center text-md font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-2 px-4 mb-6 shadow-sm">
          {message}
        </p>
      )}
  
      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">
          <SkeletonCard />
        </p>
      ) : categories.length === 0 ? (
        <p className="text-center text-red-500">
          <AdminNotAvailableLoader />
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-h-72 overflow-y-auto px-2 pr-4 space-y-4">
            {categories.map((cat) => (
              <label
                key={cat._id}
                htmlFor={`cat-${cat._id}`}
                className="flex items-center gap-5 p-4 bg-white/30 backdrop-blur-md rounded-2xl border border-white/30 hover:border-blue-400 transition duration-300 shadow-sm"
              >
                <input
                  type="checkbox"
                  value={cat._id}
                  id={`cat-${cat._id}`}
                  onChange={handleCategoryChange}
                  className="accent-blue-600 scale-125"
                />
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
                />
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{cat.title}</p>
                  <p className="text-xs text-white bg-blue-600 px-2 py-1 rounded-md mt-1 inline-block shadow-md">
                    {cat.tag}
                  </p>
                </div>
              </label>
            ))}
          </div>
  
          <div className="pt-6">
            <button
              type="submit"
              disabled={submitLoading}
              className="w-full py-3 text-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-md hover:from-blue-600 hover:to-blue-800 transition-all duration-300 relative"
            >
              {submitLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Processing...
                </span>
              ) : (
                "Add Categories"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
  
  );
};

export default AddCategoryToVendor;
