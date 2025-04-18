import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddCategoryToVendor = () => {
  const { vendorId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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
    } catch (err) {
      setMessage("❌ Failed to add categories.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Add Categories to Vendor</h2>

        {message && <p className="text-center text-sm font-medium text-blue-600 mb-4">{message}</p>}

        {loading ? (
          <p className="text-center text-gray-500 animate-pulse">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-red-500">No categories available.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex-col m-5 max-h-72 overflow-y-auto pr-2">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  htmlFor={`cat-${cat._id}`}
                  className="flex  items-center gap-7 m-4 p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md border transition"
                >
                  <input
                    type="checkbox"
                    value={cat._id}
                    id={`cat-${cat._id}`}
                    onChange={handleCategoryChange}
                    className="accent-blue-600"
                  />
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-12 h-12 rounded-full object-cover border"
                  />
                  <div className="flex gap-3">
                    <p className="font-semibold text-gray-800 capitalize">{cat.title}</p>
                    <p className="text-xs text-white bg-blue-500 inline-block px-2 py-0.5 rounded-md mt-1">
                      {cat.tag}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                disabled={submitLoading}
                className="relative w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300"
              >
                {submitLoading ? (
                  <span className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Processing...
                  </span>
                ) : (
                  "Submit Categories"
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
