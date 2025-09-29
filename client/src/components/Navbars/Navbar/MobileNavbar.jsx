import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHomeSharp } from "react-icons/io5";
import { FaUserCircle, FaBars, FaTimes, FaPaperPlane , FaPowerOff , FaStoreAlt , FaStore, FaTags } from "react-icons/fa";
import {  RiShieldUserLine } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { MdAdminPanelSettings } from "react-icons/md";
import { PiUserCirclePlusBold } from "react-icons/pi";
import { useUser } from "../../UserContext/userContext";


const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);


  const menuItems = [
    { to: "/", label: "All Products", icon: <IoHomeSharp /> },
    { to: "/category", label: "Categories", icon: <FaTags /> },
    { to: "/about", label: "About Us", icon: <AiFillProduct /> },
    { to: "/contact", label: "Contact Us", icon: <FaPaperPlane /> },
    { to: "/all-vendors", label: "Our Vendors", icon: <FaStore /> },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 transition-colors duration-200"
        onClick={toggleMenu}
        data-aos="fade-up"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={toggleMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                onClick={toggleMenu}
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-2 px-4">
                {user?.role === "admin" && (
                  <li>
                    <NavLink
                      to="/admin"
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-colors duration-200"
                    >
                      <MdAdminPanelSettings className="text-xl" />
                      Admin Panel
                    </NavLink>
                  </li>
                )}

                {menuItems.map(({ to, label, icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={toggleMenu}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                    >
                      {icon}
                      {label}
                    </NavLink>
                  </li>
                ))}

                {/* User Profile Section */}
                <li className="border-t border-gray-200 pt-4 mt-4">
                  <NavLink
                    to={
                      user && user._id
                        ? (user.role === "user" || user.role === "admin")
                          ? `/user/${user._id}/account`
                          : "/vendor/login"
                        : "/login"
                    }
                    onClick={toggleMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200"
                  >
                    {user ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-2xl text-gray-400" />
                    )}
                    <span>{user ? "My Profile" : "Login"}</span>
                  </NavLink>
                </li>

                {/* Auth Buttons for non-logged in users */}
                {!user && (
                  <li className="space-y-2 pt-4">
                    <button
                      onClick={() => {
                        navigate("/login");
                        toggleMenu();
                      }}
                      className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      <RiShieldUserLine className="w-5 h-5" />
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        toggleMenu();
                      }}
                      className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 transition-colors duration-200"
                    >
                      <PiUserCirclePlusBold className="w-5 h-5" />
                      Sign Up
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
