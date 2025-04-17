import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import ProductCard from "../../Products/ProductCard.jsx/ProductCard"; // Adjust path as needed
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import NotAvailable from "../../../pages/Loaders/NotAvailable";
const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/navigation/search-products?query=${query}`
      );
      setResults(res.data.products);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-6">
    {/* ✨ Elegant Search Bar */}
    <div className="relative w-full max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Search products, categories, or tags..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-full py-3.5 pl-5 pr-14 text-base sm:text-lg text-gray-800 placeholder-gray-400 bg-white/70 backdrop-blur-md border border-gray-300 rounded-3xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
      />
      <button
        onClick={handleSearch}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 hover:bg-indigo-700 text-white p-2 rounded-full shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:cursor-pointer"
        aria-label="Search"
      >
        <FaSearch size={18} className="hover:scale-110 transition-transform" />
      </button>
  </div>
  
      {/* Result Section */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <SkeletonList/>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="col-span-full text-center text-lg font-semibold text-gray-700">
        <NotAvailable 
  content="No Product Found" 
  tagline="Oops! It looks like we couldn't find any matching products. Try searching with different keywords or explore our collection to discover something amazing!" 
/>
          </div>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {results.length > 0 &&
          results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default SearchBox;
