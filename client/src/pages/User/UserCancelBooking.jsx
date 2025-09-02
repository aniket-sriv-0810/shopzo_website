// components/UserDeleteCancelledBooking.jsx
import React from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { useUser } from "../../components/UserContext/userContext";
const UserCancelBooking = ({ bookingId, onDeleted }) => {
const {user} = useUser();
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/${user._id}/account/bookings/${bookingId}`,
        {
            withCredentials : true
        }
      );
     
      onDeleted?.();
    } catch (err) {
      console.log("error => ", err);
      
      alert(err.response?.data?.message || "Error deleting cancelled booking");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-600 text-white px-3 py-3  rounded-full hover:scale-110 hover:cursor-pointer"
    >
      <MdDeleteForever className="text-2xl"/>
    </button>
  );
};

export default UserCancelBooking;
