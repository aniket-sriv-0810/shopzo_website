import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "./CategoryCard";

const AllCategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="py-7 px-4 bg-gradient-to-tr from-fuchsia-100 to-zinc-100 ">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Browse Categories</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading Categories...</p>
      ) : (
        <div className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1">
          {categories.map((category) => (
            <div key={category._id} className="snap-start">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCategoryCard;
