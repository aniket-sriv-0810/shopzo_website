import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTable from "../../components/Admin/AdminUser/UserTable";
import { useUser } from "../../components/UserContext/userContext";
import { useNavigate } from "react-router-dom";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";

const AdminUser = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // 🔹 add filtered state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUserDetails(response.data.data.users);
        setFilteredUsers(response.data.data.users); // 🔹 set both
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch user details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setDeleteLoading(true);
    try {
      const currentUserId = user?._id;
      const isSelfDelete = userId === currentUserId;

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/${userId}/account/delete`,
        { withCredentials: true }
      );

      setUserDetails((prev) => prev.filter((u) => u._id !== userId));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== userId)); // 🔹 keep filtered list in sync

      if (isSelfDelete && user?.role !== "admin") {
        navigate("/login");
      } else {
        navigate("/admin/users");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // 🔍 Search Handler
  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(userDetails); // reset if empty
      return;
    }

    const lower = query.toLowerCase();
    const filtered = userDetails.filter(
      (u) =>
        u.name.toLowerCase().includes(lower) ||
        u._id.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        All Registered Users
      </h1>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
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
      ) : userDetails.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Users Found"}
            tagline={"Oops! It looks like your user data is empty"}
          />
        </div>
      ) : (
        <>
          {/* 🔍 Search Bar */}
          <AdminSearchBar
            placeholder="Search users by name or ID..."
            onSearch={handleSearch}
          />

          {/* User Table */}
          <UserTable
            users={filteredUsers}
            loggedInUser={user}
            deleteUser={deleteUser}
          />
        </>
      )}
    </div>
  );
};

export default AdminUser;
