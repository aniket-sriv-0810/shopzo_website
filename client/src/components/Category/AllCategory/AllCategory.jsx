import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import ToggleGender from "../../ToggleGender/ToggleGender";
import SkeletonList from "../../LoadingSkeleton/SkeletonList";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedGender, setSelectedGender] = useState("male");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`, {
          withCredentials: true,
        });
        const fetched = res.data?.data?.categories;
        if (fetched?.length > 0) {
          setCategories(fetched);
        } else {
          setError("No categories found.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (cat) => cat.tag?.toLowerCase() === selectedGender
  );

  return (
    <section className="py-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
          Explore Categories
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Discover products by your interests
        </p>

        <div className="mt-6">
          <ToggleGender onToggle={(gender) => setSelectedGender(gender)} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-16">
          <SkeletonList />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      ) : (
        <>
          {/* Horizontal scroll on small devices, grid on sm+ */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            <div className="flex gap-4">
              {filteredCategories.map((category) => (
                <div key={category._id} className="flex-shrink-0 w-full">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto px-2 sm:px-4">
            {filteredCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default AllCategories;
