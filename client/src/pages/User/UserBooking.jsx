// pages/UserBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../../components/User/UserBooking/UserBookingCard";
import { useUser } from "../../components/UserContext/userContext";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import SkeletonList from "../../components/LoadingSkeleton/SkeletonList";
import NotAvailable from "../Loaders/NotAvailable";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!user?._id) return; // ✅ prevent API call when user not loaded yet

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${user._id}/account/bookings`,
          { withCredentials: true }
        );
        console.log("booking =>", res.data.data);
        setBookings(res.data.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Function to handle successful booking cancellation
  const handleCancelSuccess = (cancelledBookingId) => {
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== cancelledBookingId)
    );
  };

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <UserNavbar />
      </div>

      <div className="bg-gray-100 max-w-full mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-7">
          My Orders
        </h2>

        {loading ? (
          <div className="flex flex-col justify-center items-center mt-10 md:flex-row">
            <SkeletonList />
          </div>
        ) : bookings.length === 0 ? (
          <div className="col-span-full text-center text-lg font-semibold text-gray-700">
            <NotAvailable
              content={"No Bookings Found"}
              tagline={
                "Oops! You haven't done any bookings yet. Start exploring and discover your products!"
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                userId={user._id} // ✅ Pass actual user ID
                onCancelSuccess={handleCancelSuccess}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserBookings;
