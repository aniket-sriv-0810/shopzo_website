import React from "react";
import { FaUsers, FaStore, FaTags, FaClipboardList, FaComments, FaBox } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminStat = ({ adminData }) => {
  const stats = [
    { id: "users-btn", count: adminData.totalUsers, label: "Users Registered", icon: <FaUsers className="text-green-600 text-4xl" />, link: "/admin/users" },
    { id: "vendors-btn", count: adminData.totalVendors, label: "Vendors Listed", icon: <FaStore className="text-red-500 text-4xl" />, link: "/admin/vendors" },
    { id: "categories-btn", count: adminData.totalCategories, label: "Categories Available", icon: <FaTags className="text-fuchsia-500 text-4xl" />, link: "/admin/categories" },
    { id: "products-btn", count: adminData.totalProducts, label: "Products Listed", icon: <FaBox className="text-teal-500 text-4xl" />, link: "/admin/products" },
    { id: "bookings-btn", count: adminData.totalBookings, label: "Orders Received", icon: <FaClipboardList className="text-amber-500 text-4xl" />, link: "/admin/bookings" },
    { id: "feedbacks-btn", count: adminData.totalFeedbacks, label: "Feedbacks Received", icon: <FaComments className="text-indigo-500 text-4xl" />, link: "/admin/feedbacks" },
  ];

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3  m-auto gap-8">
      {stats.map(({ id, count, label, icon, link }) => (
        <div
          key={id}
          id={id}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition hover:scale-105 flex flex-col justify-center items-center"
        >
          <div className="bg-gray-100 p-4 rounded-full shadow-md">{icon}</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3 mb-1">
            {count !== 0 ? count : (
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
            )}
          </h2>
          <p className="text-gray-600 mb-3 font-medium text-lg">{label}</p>
          <NavLink to={link}>
          <button
            className="w-60 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-gradient-to-bl from-fuchsia-700 to-indigo-500 text-white backdrop-blur-md shadow-lg hover:shadow-xl  transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400 hover:cursor-pointer hover:scale-110"
          >
            <span className="z-10">Check Now</span>
            {/* Optional subtle glow on hover */}
            <span className="absolute inset-0 rounded-xl bg-gradient-to-bl from-fuchsia-600 to-indigo-400 opacity-0 group-hover:opacity-10 transition-all duration-300" />

          </button>
          </NavLink>
        </div>
      ))}
    </div>
  );
};

export default AdminStat;
