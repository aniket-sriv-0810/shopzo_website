import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AddCategoryToVendor = () => {
  const { vendorId } = useParams(); // Extract vendorId from the URL params
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
        const fetchedCategories = res.data?.data?.categories || [];

        console.log("Fetched categories:", fetchedCategories);
        setCategories(fetchedCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    if (e.target.checked) {
      setSelectedCategories((prev) => [...prev, categoryId]);
    } else {
      setSelectedCategories((prev) =>
        prev.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/vendor/${vendorId}/add-categories`,
        { categoryIds: selectedCategories },
        { withCredentials: true }
      );
      setMessage("Categories added successfully!");
    } catch (err) {
      setMessage("Failed to add categories.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Add Categories to Vendor</h2>

        {message && (
          <p className="text-center text-sm text-blue-600 mb-4">{message}</p>
        )}

        {loading ? (
          <p className="text-center text-gray-500">Loading categories...</p>
        ) : !Array.isArray(categories) || categories.length === 0 ? (
          <p className="text-center text-red-500">No categories available.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-200 max-h-64 overflow-y-auto">
              <p className="text-xs text-red-400">Available: {categories.length} categories</p>
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={cat._id}
                    onChange={handleCategoryChange}
                    className="mr-2"
                    id={`category-${cat._id}`}
                  />
                  <label htmlFor={`category-${cat._id}`} className="text-sm text-black">
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Submit Categories
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddCategoryToVendor;
