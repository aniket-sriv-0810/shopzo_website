import React, { useEffect } from "react";
import { Outlet , NavLink} from "react-router-dom";
import AdminNavbar from '../../components/Navbars/AdminNavbar/AdminNavbar';
import { ImStatsDots } from "react-icons/im";
import { IoStatsChartSharp } from "react-icons/io5";

const AdminHome = () => {

  return (
    <>
    <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
      <AdminNavbar />
    </div>
      <div className="min-h-screen bg-gray-100 py-10 px-5 sm:px-20 flex flex-col items-center justify-center">
        {/* Welcome Section */}
        <div className="bg-white shadow-lg rounded-xl p-6 md:p-10 text-center max-w-4xl mx-auto">
        <span className="flex items-center justify-center gap-2 xs:gap-5 md:gap-5">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-4">
            Welcome to the Admin Panel 
          </h1>
          <IoStatsChartSharp className="text-4xl mb-4  text-blue-700 "/>
        </span>
          <p className="text-gray-600 text-lg">
            Manage users, hotels, bookings, and more with full control over the platform.  
            Keep an eye on statistics, review performance, and ensure a smooth experience  
            for your users.  
          </p>
        </div>
        <NavLink to="/admin/dashboard">
  <button className="flex items-center gap-3 rounded-full mt-10 text-white bg-gradient-to-r from-green-500 to-green-700 px-6 py-4 font-semibold shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ease-in-out" data-aos="fade-down">
    <ImStatsDots className="text-xl" /> {/* Dashboard Icon */}
    View Dashboard
  </button>
</NavLink>
        {/* Animated Content */}
        <div className="w-full mt-10" data-aos="fade-up">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminHome;
