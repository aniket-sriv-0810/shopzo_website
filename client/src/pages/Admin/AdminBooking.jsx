import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookingTable from '../../components/Admin/AdminBooking/BookingTable';
import SkeletonTable from '../../components/LoadingSkeleton/SkeletonTable';
const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading , setLoading] = useState(false);
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/bookings`, { withCredentials: true });
      setBookings(res.data.data.allBookingDetails);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-6">All Bookings</h2>
      {loading ? 
        <div className='flex justify-center items-center mt-10'>
      <SkeletonTable/> 
        </div>
      : bookings ?
      <BookingTable bookings={bookings} />
      :
      <p className='text-center text-red-500 '>No Bookings Available</p>
      }
    </div>
  );
};

export default AdminBooking;
