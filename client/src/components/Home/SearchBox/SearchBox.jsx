import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ProductCard from "../../Products/ProductCard.jsx/ProductCard";
import VendorCard from "../../Vendors/VendorCard.jsx/VendorCard";
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import NotAvailable from "../../../pages/Loaders/NotAvailable";
import Pagination from "../../Pagination/Pagination"; // assuming same folder or adjust path

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ products: [], vendors: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (overridePage = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/navigation/search-all`,
        {
          params: { query, page: overridePage, limit: 6 },
        }
      );

      setResults({ products: res.data.products, vendors: res.data.vendors });
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searched) {
      handleSearch(page);
    }
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6">
      {/* Search Input */}
      <div className="relative w-full max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search products, vendors, categories or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full py-3.5 pl-5 pr-14 text-base sm:text-lg text-gray-800 placeholder-gray-400 bg-white/70 backdrop-blur-md border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-all duration-300"
          aria-label="Search"
        >
          <FaSearch size={18} />
        </button>
      </div>

      {/* Results */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <SkeletonList />
        </div>
      )}

      {!loading && searched && results.products.length === 0 && results.vendors.length === 0 && (
        <NotAvailable
          content="Nothing Found"
          tagline="Try a different search term or explore our full collection!"
        />
      )}

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {results.vendors.map((vendor) => (
          <VendorCard key={vendor._id} vendor={vendor} />
        ))}
        {results.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={page}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default SearchBox;
