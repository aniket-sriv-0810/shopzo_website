import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";
import { RiShieldUserLine } from "react-icons/ri";
import { PiUserCirclePlusBold } from "react-icons/pi";
import { useUser } from "../../UserContext/userContext";
import NavImg from "./NavImg";
const DesktopNavbar = () => {
  const { user} = useUser();
  const navigate = useNavigate();


  const navItems = [

    { to: "/", label: "Home", tooltip: "Home" },
    { to: "/category", label: "Categories", tooltip: "Categories" },
    { to: "/vendors", label: "Vendors", tooltip: "Vendors" },
    { to: "/about", label: "About", tooltip: "About" },
    { to: "/contact", label: "Connect", tooltip: "Connect" },
  ];



  return (
    <div className="hidden lg:flex items-center">
      {/* Navigation Links */}
      <ul className="flex items-center space-x-8">
        {user?.role === "admin" && (
          <li>
            <NavLink 
              to="/admin/dashboard" 
              className="text-gray-700 hover:text-yellow-500 hover:font-semibold transition-colors duration-200 px-3 py-2 rounded-md"
            >
              Admin
            </NavLink>
          </li>
        )}
        {user?.role === "intern" && (
          <li>
            <NavLink 
              to="/intern/dashboard" 
              className="text-gray-700 hover:text-blue-500 hover:font-semibold transition-colors duration-200 px-3 py-2 rounded-md"
            >
              Intern
            </NavLink>
          </li>
        )}
        {navItems.map(({ to, label }) => (
          <li key={to}>
            <NavLink 
              to={to} 
              className="text-gray-700 hover:text-black hover:font-semibold transition-all duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      
      {/* User Profile Section */}
        {user && user._id ? (
          <NavLink
            to={
              (user.role === "user" || user.role === "admin" || user.role === "intern")
                ? `/user/${user._id}/account`
                : "/vendor/login"
            }
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden lg:block">{user.name}</span>
          </NavLink>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors duration-200"
            >
              <RiShieldUserLine className="w-5 h-5" />
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors duration-200"
            >
              <PiUserCirclePlusBold className="w-5 h-5" />
              Sign Up
            </button>
          </div>
        )}
    </div>
  );
};

export default DesktopNavbar;
