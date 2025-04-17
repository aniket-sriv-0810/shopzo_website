import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../components/UserContext/userContext";
import AdminStat from "../../components/Admin/AdminDashboard/AdminStat";
import AdminInfo from "../../components/Admin/AdminDashboard/AdminInfo";

const AdminDashboard = () => {
  const { user } = useUser();
  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalCategories: 0,
    totalProducts: 0,
    totalBookings: 0,
    totalFeedbacks: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, { withCredentials: true })
      .then((res) => setAdminData(res.data.data))
      .catch((err) => console.error("Error fetching admin dashboard data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 py-10 px-4 sm:px-10">
      <AdminInfo user={user} />
      <AdminStat adminData={adminData} />
    </div>
  );
};

export default AdminDashboard;
