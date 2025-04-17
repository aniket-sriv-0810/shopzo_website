import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTable from "../../components/Admin/AdminUser/UserTable";
import { useUser } from "../../components/UserContext/userContext";
import { useNavigate } from "react-router-dom";

const AdminUser = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${userId}/account/delete`, {
        withCredentials: true,
      });
      setUserDetails((prev) => prev.filter((u) => u._id !== userId));
      navigate("/delete/successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Registered Users
      </h1>

      {loading ? (
        <p>loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : userDetails.length === 0 ? (
        <p className="text-center text-gray-600 font-medium">No users found.</p>
      ) : (
        <UserTable users={userDetails} loggedInUser={user} deleteUser={deleteUser} />
      )}
    </div>
  );
};

export default AdminUser;
