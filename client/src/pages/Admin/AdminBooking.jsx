import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingTable from '../../components/Admin/AdminBooking/BookingTable';
import SkeletonTable from '../../components/LoadingSkeleton/SkeletonTable';
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/bookings`, {
        withCredentials: true
      });
      setBookings(res.data.data.allBookingDetails);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDeleteBooking = (deletedId) => {
    setBookings(prev => prev.filter(booking => booking._id !== deletedId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">All Bookings Received</h2>
      {loading ? (
        <div className='flex justify-center items-center mt-10'>
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
            content={"No Booking data Found"}
            tagline={"Oops! It looks like your booking data is empty"}
          />
        </div>
      ) : (
        <BookingTable bookings={bookings} onDelete={handleDeleteBooking} />
      )}
    </div>
  );
};

export default AdminBooking;
