import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorBookingTable from '../../../components/Vendors/VendorBookings/VendorBookingTable';
import SkeletonTable from '../../../components/LoadingSkeleton/SkeletonTable';
import NotAvailable from '../../Loaders/NotAvailable';
import ErrorPopup from '../../../components/Popups/ErrorPopUp';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../../components/UserContext/userContext';
import VendorNavbar from '../../../components/Navbars/VendorNavbar/VendorNavbar'
const VendorBookings = () => {
    const {user} = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: vendorId } = useParams(); // get vendor ID from route param
  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/account/all-bookings`,
        { withCredentials: true }
      );
      setBookings(res.data.data); // Already formatted by controller
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
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
      <h2 className="text-2xl text-center font-bold mb-9">All Bookings Received</h2>
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
              navigate('/vendor'); // Optional: navigate vendor home or dashboard
            }}
          />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <NotAvailable
            content={'No Booking data Found'}
            tagline={'Oops! It looks like your booking data is empty'}
          />
        </div>
      ) : (
        <VendorBookingTable bookings={bookings} />
      )}
    </div>
    </>
  );
};

export default VendorBookings;
