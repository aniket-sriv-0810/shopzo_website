import React, { useEffect, useState } from "react";
import axios from "axios";
import DeliveryTable from "../../components/Admin/AdminDelivery/DeliveryTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";

const AdminDelivery = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDeliveries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/deliveries`,
        { withCredentials: true }
      );
      setDeliveries(res.data.data.allDeliveryDetails);
      setFilteredDeliveries(res.data.data.allDeliveryDetails); // ✅ keep copy
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch delivery details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // ❌ Delete Handler
  const handleDeleteDelivery = (deletedId) => {
    setDeliveries((prev) => prev.filter((delivery) => delivery._id !== deletedId));
    setFilteredDeliveries((prev) =>
      prev.filter((delivery) => delivery._id !== deletedId)
    );
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredDeliveries(deliveries);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = deliveries.filter(
      (d) =>
        (d?._id && d._id.toLowerCase().includes(lower)) ||
        (d?.status && d.status.toLowerCase().includes(lower))
    );
    setFilteredDeliveries(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">
        All Deliveries Received
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
      ) : deliveries.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Delivery data Found"}
            tagline={"Oops! It looks like your delivery data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search deliveries by ID, customer name, or status..."
            onSearch={handleSearch}
          />

          <DeliveryTable
            deliveries={filteredDeliveries}
            onDelete={handleDeleteDelivery}
          />
        </>
      )}
    </div>
  );
};

export default AdminDelivery;