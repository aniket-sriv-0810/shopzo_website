import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingTable from "../../components/Admin/AdminBooking/BookingTable";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";
import { authAxios } from "../../utils/auth";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get('/api/admin/bookings');
      setBookings(res.data.data.allBookingDetails);
      setFilteredBookings(res.data.data.allBookingDetails); // ✅ keep copy
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ❌ Delete Handler
  const handleDeleteBooking = (deletedId) => {
    setBookings((prev) => prev.filter((booking) => booking._id !== deletedId));
    setFilteredBookings((prev) =>
      prev.filter((booking) => booking._id !== deletedId)
    );
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredBookings(bookings);
      return;
    }

    const lower = query.toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        (b?._id && b._id.toLowerCase().includes(lower)) ||
        (b?.status && b.status.toLowerCase().includes(lower))
    );
    setFilteredBookings(filtered);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">
        All Orders Received
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
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Order data Found"}
            tagline={"Oops! It looks like your order data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search orders by ID, customer name, or status..."
            onSearch={handleSearch}
          />

          <BookingTable
            bookings={filteredBookings}
            onDelete={handleDeleteBooking}
          />
        </>
      )}
    </div>
  );
};

export default AdminBooking;
