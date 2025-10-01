import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTable from "../../components/Admin/AdminUser/UserTable";
import { useUser } from "../../components/UserContext/userContext";
import { useNavigate } from "react-router-dom";
import SkeletonTable from "../../components/LoadingSkeleton/SkeletonTable";
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import AdminSearchBar from "../../components/Admin/AdminSearchBar/AdminSearchBar";
import { authAxios } from "../../utils/auth";

const AdminUser = () => {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await authAxios.get('/api/admin/users');
      if (response.status === 200) {
        setUserDetails(response.data.data.users);
        setFilteredUsers(response.data.data.users);
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

      await authAxios.delete(`/api/user/${userId}/account/delete`);

      setUserDetails((prev) => prev.filter((u) => u._id !== userId));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== userId));

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

  const handleSearch = (query) => {
    if (!query) {
      setFilteredUsers(userDetails);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = userDetails.filter(
      (u) => u.name.toLowerCase().includes(lower) || u._id.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  };

  const handleRoleUpdate = (updatedUser) => {
    const updatedUsersList = userDetails.map((u) =>
      u._id === updatedUser._id ? updatedUser : u
    );
    setUserDetails(updatedUsersList);
    setFilteredUsers(updatedUsersList);
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
          <AdminSearchBar
            placeholder="Search users by name or ID..."
            onSearch={handleSearch}
          />
          <UserTable
            users={filteredUsers}
            loggedInUser={user}
            deleteUser={deleteUser}
            onRoleUpdate={handleRoleUpdate} // Pass the handler
          />
        </>
      )}
    </div>
  );
};

export default AdminUser;