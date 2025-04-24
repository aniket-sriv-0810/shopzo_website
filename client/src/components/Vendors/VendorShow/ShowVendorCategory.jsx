import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CategoryCard from "../../Category/AllCategory/CategoryCard";
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import ToggleGender from "../../ToggleGender/ToggleGender";
import Pagination from "../../Pagination/Pagination"; // Make sure path is correct

const ShowVendorCategory = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedGender, setSelectedGender] = useState("male");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 6;

  const fetchVendorCategories = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/details/categories-listed`,
        { withCredentials: true }
      );

      if (res.status === 200) {
        setCategories(res.data.categories);

        setError("");
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

  // Filter by gender
  const filteredCategories = categories.filter(
    (cat) => cat.tag?.toLowerCase() === selectedGender
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLast = currentPage * categoriesPerPage;
  const indexOfFirst = indexOfLast - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 min-h-screen transition-colors duration-300">
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-white mb-2">
          Explore Our Top Categories
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Discover products by your interests
        </p>

        {/* Toggle Button */}
        <div className="mt-6">
          <ToggleGender
            onToggle={(gender) => {
              setSelectedGender(gender);
              setCurrentPage(1); // reset pagination on gender change
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-16">
          <SkeletonList />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      ) : filteredCategories.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No {selectedGender} categories found for this vendor.
        </p>
      ) : (
        <>
          {/* Scrollable row on small screens */}
          <div className="sm:hidden overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
            <div className="flex gap-4">
              {currentCategories.map((category) => (
                <div key={category._id} className="w-full">
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </div>

          {/* Grid on larger screens */}
          <div className="hidden sm:grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto px-2 sm:px-4">
            {currentCategories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </section>
  );
};

export default ShowVendorCategory;
