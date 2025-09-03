import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CategoryCard from "./CategoryCard";

const AllCategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
      const all = res.data?.data?.categories || [];

      // ✅ Sort: Female categories first, then Male
      const sorted = [...all.filter(c => c.tag === "female"), ...all.filter(c => c.tag === "male")];

      // ✅ Duplicate list for infinite scroll effect
      const infiniteList = [...sorted, ...sorted];
      setCategories(infiniteList);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Optional: Looping scroll reset for illusion of true infinite scroll
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.offsetWidth;

    // If at end, reset to start
    if (scrollLeft + containerWidth >= scrollWidth - 1) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="py-7 px-4 bg-gradient-to-tr from-fuchsia-100 to-zinc-100">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">Browse Categories</h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading Categories...</p>
      ) : (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
        >
          {categories.map((category, index) => (
            <div key={`${category._id}-${index}`} className="snap-start">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCategoryCard;
