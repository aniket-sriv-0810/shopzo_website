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
    // Update the bookings list by removing the cancelled booking
    setBookings((prevBookings) =>
      prevBookings.filter((booking) => booking._id !== cancelledBookingId)
    );
  };

  return (
    <>
         <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
      <UserNavbar />
    </div>
    <div className="max-w-5xl mx-auto px-4 py-8">
    <h2 className="text-center text-3xl font-bold text-gray-900 mt-10 mb-7">My Bookings</h2>

      {loading ? (
        <div className="flex-col justify-center items-center mt-10 md:flex-row">
            <SkeletonList />
          </div>
      ) : bookings.length === 0 ? (
        <div className="col-span-full  text-center text-lg font-semibold text-gray-700">
                  <NotAvailable
                    content={"No Bookings Found"}
                    tagline={
                      "Oops! You haven't done any bookings yet. Start exploring and discover your products!"
                    }
                  />
                </div>
      ) : (
        bookings.map((booking) => (
          <BookingCard
    key={booking._id}
    booking={booking}
    userId={user._id} // ✅ Pass actual user ID
    onCancelSuccess={handleCancelSuccess}
  />
        ))
      )}
    </div>
    </>
  );
};

export default UserBookings;
