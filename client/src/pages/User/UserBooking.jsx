import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../../components/User/UserBooking/UserBookingCard";
import { useUser } from "../../components/UserContext/userContext";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import NotAvailable from "../Loaders/NotAvailable";
import { authAxios } from "../../utils/auth";

const UserStoreOrders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchBookings = async () => {
    try {
      const res = await authAxios.get(`/api/user/${id}/booking`);
      setBookings(res.data.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchBookings();
    }
  }, [user]);

  // Function to handle successful booking cancellation or deletion
  const handleSuccess = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== bookingId)
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <SkeletonList />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center text-lg font-semibold text-gray-700">
        <NotAvailable
          content={"No Store Orders Found"}
          tagline={
            "Oops! You haven't placed any store orders yet. Start exploring and discover your products!"
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          userId={user._id}
          onCancelSuccess={handleSuccess}
        />
      ))}
    </div>
  );
};

export default UserStoreOrders;