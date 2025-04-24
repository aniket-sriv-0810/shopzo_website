import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorCard from "../../components/Vendors/VendorCard.jsx/VendorCard";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import Pagination from "../../components/Pagination/Pagination";
import NotAvailable from "../Loaders/NotAvailable";
const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const  {data}  = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/all-vendors`);
        setVendors(data.data);
      } catch (error) {
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

   useEffect(() => {
      const handleResize = () => {
        const width = window.innerWidth;
        if (width > 1024) {
          setItemsPerPage(6);
        } else if (width > 640) {
          setItemsPerPage(6);
        } else {
          setItemsPerPage(4);
        }
      };
  
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
   // Pagination logic
    const totalPages = Math.ceil(vendors.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = vendors.slice(indexOfFirstItem, indexOfLastItem);
  
    // Reset page to 1 when gender changes
    useEffect(() => {
      setCurrentPage(1);
    }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-12">
      <h1 className="text-4xl font-bold text-center text-white mb-3">
        Our Top Vendors
      </h1>
      <h1 className=" font-sans text-sm text-center text-gray-300 mb-10">
        Find your desired products from their collections
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonList/>
        </div>
      )
      : error ? (
        <div className="col-span-full  text-center text-lg font-semibold text-gray-700">
              <NotAvailable content={"No Vendors Available"} tagline={" Oops! It looks like your vendor data is empty ."} />
              </div>
      ) : (
        <>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentItems.map((vendor) => (
  <VendorCard key={vendor._id} vendor={vendor} />
))}
        </div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default AllVendors;
