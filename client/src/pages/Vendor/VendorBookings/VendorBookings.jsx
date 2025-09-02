import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorBookingTable from '../../../components/Vendors/VendorBookings/VendorBookingTable';
import SkeletonTable from '../../../components/LoadingSkeleton/SkeletonTable';
import NotAvailable from '../../Loaders/NotAvailable';
import ErrorPopup from '../../../components/Popups/ErrorPopUp';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../components/UserContext/userContext';
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar';
import AdminSearchBar from "../../../components/Admin/AdminSearchBar/AdminSearchBar";

const VendorBookings = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: vendorId } = useParams(); 
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/account/all-bookings`,
        { withCredentials: true }
      );
      setBookings(res.data.data);
      setFilteredBookings(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredBookings(bookings);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = bookings.filter(
      (b) =>
        b.user?.name?.toLowerCase().includes(lower) ||
        b.bookingId?.toLowerCase().includes(lower)
    );
    setFilteredBookings(filtered);
  };

  useEffect(() => {
    if (vendorId) fetchBookings();
  }, [vendorId]);

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <VendorNavbar />
      </div>
      <div className="p-6">
        <h2 className="text-2xl text-center font-bold mb-9">
          All Bookings Received
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
                setError('');
                navigate('/vendor');
              }}
            />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center text-gray-600 font-medium">
            <NotAvailable
              content={'No Booking data Found'}
              tagline={'Oops! It looks like your booking data is empty'}
            />
          </div>
        ) : (
          <>
            <AdminSearchBar
              placeholder="Search bookings by customer or Booking ID..."
              onSearch={handleSearch}
            />
            <VendorBookingTable
              bookings={filteredBookings}
              onDelete={(deletedId) =>
                setBookings((prev) => prev.filter((b) => b.bookingId !== deletedId))
              }
            />
          </>
        )}
      </div>
    </>
  );
};

export default VendorBookings;
