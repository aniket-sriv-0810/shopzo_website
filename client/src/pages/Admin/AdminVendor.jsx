import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorTable from "../../components/Admin/AdminVendor/VendorTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";
import { authAxios } from "../../utils/auth";

const AdminVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get('/api/admin/vendors');
      setVendors(response.data.data.allVendorDetails);
      setFilteredVendors(response.data.data.allVendorDetails); // ✅ keep a copy for search
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // ❌ Delete Handler
  const handleDeleteVendor = (deletedId) => {
    setVendors((prev) => prev.filter((vendor) => vendor._id !== deletedId));
    setFilteredVendors((prev) =>
      prev.filter((vendor) => vendor._id !== deletedId)
    );
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
        (v?.name && v.name.toLowerCase().includes(lower)) ||
        (v?._id && v._id.toLowerCase().includes(lower))
    );
    setFilteredVendors(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">
        All Registered Vendors
      </h2>

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
            tagline={"Oops! It looks like your vendor data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search vendors by name or ID..."
            onSearch={handleSearch}
          />
          <VendorTable
            vendors={filteredVendors}
            onDelete={handleDeleteVendor}
          />
        </>
      )}
    </div>
  );
};

export default AdminVendor;