import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorTable from "../../components/Admin/AdminVendor/VendorTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";

const AdminVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const navigate = useNavigate();

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/vendors`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        const allVendors = response.data.data.allVendorDetails || [];
        setVendors(allVendors);
        setFilteredVendors(allVendors); // keep a copy for search
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/category`);
      setCategories(res.data.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchVendors(), fetchCategories()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Delete vendor logic
  const deleteVendor = async (vendorId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/vendor/${vendorId}/account/delete`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Refresh vendor list after deletion
        setVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
        setFilteredVendors((prev) => prev.filter((vendor) => vendor._id !== vendorId));
      }
      navigate("/admin/vendors");
    } catch (err) {
      console.error("Failed to delete vendor:", err);
      setError("Error deleting vendor. Please try again later.");
    }
  };

  // 🔍 Search function
  const handleSearch = (query) => {
    if (!query) {
      setFilteredVendors(vendors); // reset if empty
      return;
    }

    const lower = query.toLowerCase();
    const filtered = vendors.filter(
      (v) =>
        v.name.toLowerCase().includes(lower) ||
        v._id.toLowerCase().includes(lower)
    );
    setFilteredVendors(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-9">
        All Registered Vendors
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <SkeletonTable />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">
          <ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin");
            }}
          />
        </div>
      ) : vendors.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Vendors Found"}
            tagline={" Oops! It looks like your vendor data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search vendors by name or ID..."
            onSearch={handleSearch}
          />

          {/* Vendor Table */}
          <VendorTable
            vendors={filteredVendors}
            categories={categories}
            refreshVendors={fetchAll}
            deleteVendor={deleteVendor}
          />
        </>
      )}
    </div>
  );
};

export default AdminVendor;
