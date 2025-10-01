import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../Products/ProductCard.jsx/ProductCard";
import VendorCard from "../../Vendors/VendorCard.jsx/VendorCard";
import SkeletonList from "../../LoadingSkeleton/SkeletonList";
import NotAvailable from "../../../pages/Loaders/NotAvailable";
import Pagination from "../../Pagination/Pagination";
import { authAxios } from "../../../utils/auth";

const SearchBox = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({ products: [], vendors: [] });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentQuery, setCurrentQuery] = useState("");

  const handleSearchWithQuery = async (searchQuery, overridePage = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    setCurrentQuery(searchQuery);

    try {
      const res = await authAxios.get("/api/navigation/search-all", {
        params: { query: searchQuery, page: overridePage, limit: 4 }
      });

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

  // Handle initial query from URL parameters
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery.trim()) {
      setSearched(true);
      // Trigger search with the URL query
      handleSearchWithQuery(urlQuery.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (searched && currentQuery) {
      handleSearchWithQuery(currentQuery, page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-10">
      {/* Search Results Header */}
      

      {/* Results Section */}
      <div className="space-y-12">
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
