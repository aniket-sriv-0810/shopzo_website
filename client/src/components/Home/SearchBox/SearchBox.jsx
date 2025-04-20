import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ProductCard from "../../Products/ProductCard.jsx/ProductCard";
import VendorCard from "../../Vendors/VendorCard.jsx/VendorCard";
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import NotAvailable from "../../../pages/Loaders/NotAvailable";
import Pagination from "../../Pagination/Pagination";

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
          params: { query, page: overridePage, limit: 4 },
        }
      );

      const {
        vendors,
        products,
        totalPages,
        currentPage,
      } = res.data;

      setResults({ vendors, products });
      setTotalPages(totalPages);
      setPage(currentPage);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      {/* Search Input */}
      <div className="relative w-full max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search products, vendors, categories or tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full py-3.5 pl-5 pr-14 text-base sm:text-lg text-gray-800 placeholder-gray-400 bg-white/70 backdrop-blur-md border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
        />
        <button
          onClick={() => handleSearch()}
          className="absolute hover:cursor-pointer top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-all duration-300"
        >
          <FaSearch size={18} />
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-12 space-y-12">
        {loading && (
          <div className="flex justify-center items-center">
            <SkeletonList />
          </div>
        )}

        {!loading && searched && !results.products.length && !results.vendors.length && (
          <NotAvailable
            content="Nothing Found"
            tagline="Try a different search term or explore our full collection!"
          />
        )}

        {!loading && searched && results.products.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Product Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.vendors.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Vendor Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.vendors.map((vendor) => (
                <VendorCard key={vendor._id} vendor={vendor} />
              ))}
            </div>
          </div>
        )}

        {!loading && searched && (results.products.length > 0 || results.vendors.length > 0) && (
          <div className="mt-10">
            <Pagination
              totalPages={totalPages}
              currentPage={page}
              handlePageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
