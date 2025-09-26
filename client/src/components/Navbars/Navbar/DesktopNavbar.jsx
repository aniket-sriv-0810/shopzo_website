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
    </div>
  );
};

export default DesktopNavbar;
