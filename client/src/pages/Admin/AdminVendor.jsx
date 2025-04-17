import React, { useEffect, useState } from "react";
import axios from "axios";
import VendorTable from "../../components/Admin/AdminVendor/VendorTable";

const AdminVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendors = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/vendors`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setVendors(response.data.data.allVendorDetails);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch vendors");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Registered Vendors
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : vendors.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">No vendors found.</p>
      ) : (
        <VendorTable vendors={vendors} categories={categories} refreshVendors={fetchAll} />
      )}
    </div>
  );
};

export default AdminVendor;
