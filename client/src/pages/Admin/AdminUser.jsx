import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTable from "../../components/Admin/AdminUser/UserTable";
import { useUser } from "../../components/UserContext/userContext";
import { useNavigate } from "react-router-dom";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
const AdminUser = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deleteLoading , setDeleteLoading] = useState(false);
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserDetails(response.data.data.users);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch user details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


const deleteUser = async (userId) => {
  setDeleteLoading(true);

  try {
    const currentUserId = user?._id; // Assuming `user` comes from context or props
    const isSelfDelete = userId === currentUserId;

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/user/${userId}/account/delete`,
      { withCredentials: true }
    );

    setUserDetails((prev) => prev.filter((u) => u._id !== userId));

    if (isSelfDelete && user?.role !== "admin") {
      // Optional: redirect to login if it's the current user (non-admin)
      navigate("/login");
    } else {
      // Stay on admin page if not deleting self or admin is deleting others
      navigate("/admin/users");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Failed to delete user.");
  } finally {
    setDeleteLoading(false);
  }
};


  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl  font-bold text-center text-gray-800 mb-8">
        All Registered  Users
      </h1>

      {loading ? (
        <div className='flex justify-center items-center mt-10'>
      <SkeletonTable/> 
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium"><ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin"); // Optional: redirect or reload logic
            }}
          /></div>
      ) : userDetails.length === 0 ? (
        <div className="text-center text-gray-600 font-medium"><AdminNotAvailableLoader content={"No Users Found"} tagline={" Oops! It looks like your user data is empty"}/></div>
      ) : (
        <UserTable users={userDetails} loggedInUser={user} deleteUser={deleteUser} />
      )}
    </div>
  );
};

export default AdminUser;
