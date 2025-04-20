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
      {/* Hamburger Icon */}
      <button
        className="absolute right-4 sm:right-8 lg:hidden text-black focus:outline-none "
        onClick={toggleMenu}
        data-aos="fade-up"
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 right-0 w-full h-max text-white z-50 bg-gradient-to-t from-zinc-800 to-gray-900 p-6 shadow-lg transition-all duration-300">
          <button className="absolute top-4 right-7 sm:right-10 text-white  sm:py-3" onClick={toggleMenu}>
            <FaTimes size={24} />
          </button>

          <ul className="mt-8 space-y-7 p-4 text-sm sm:text-xl flex flex-col items-center justify-center">
            {user?.role === "admin" && (
              <li className="opacity-80 flex items-center justify-center p-2.5 gap-2 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
                <MdAdminPanelSettings className="text-xl" />
                <NavLink to="/admin" onClick={toggleMenu}>
                  Admin Panel
                </NavLink>
              </li>
            )}

            {menuItems.map(({ to, label, icon }) => (
              <li key={to} className="opacity-80 flex items-center justify-center p-2.5 gap-2.5 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
                {icon}
                <NavLink to={to} onClick={toggleMenu}>
                  {label}
                </NavLink>
              </li>
            ))}

            <li className="opacity-80 flex items-center justify-center p-2.5 gap-2 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
  {/* Determine the correct route */}
  <NavLink to={
    user
      ? (user.role === "user" || user.role === "admin")
        ? `/user/${user._id}/account`
        : "/vendor/login"
      : "/login"
  }>
    {user ? (
      <img
        src={user.image}
        alt={user.name}
        className="w-10 h-10 rounded-full hover:scale-110 transition duration-200"
      />
    ) : (
      <FaUserCircle className="text-2xl text-white" />
    )}
  </NavLink>

  <NavLink
    to={
      user
        ? (user.role === "user" || user.role === "admin")
          ? `/user/${user._id}/account`
          : "/vendor/login"
        : "/login"
    }
    onClick={toggleMenu}
  >
    My Profile
  </NavLink>
</li>


            {user ? (
              <button
                onClick={() => navigate("/logout")}
                className="bg-red-500 px-4 py-2 rounded-lg w-48 hover:bg-red-600 flex justify-center items-center gap-2 sm:w-60"
              >
                Logout <FaPowerOff className="text-white w-5 h-5" />
              </button>
            ) : (
              <div className="flex flex-col space-y-6">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-green-500 px-4 py-2 rounded-lg w-40 hover:bg-green-600 flex justify-center items-center gap-2 sm:w-60"
                >
                  Login <RiShieldUserLine className="text-white w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="bg-blue-500 px-4 py-2 rounded-lg w-40 hover:bg-blue-600 flex justify-center items-center gap-2 sm:w-60"
                >
                  Sign Up <PiUserCirclePlusBold className="text-white w-5 h-5" />
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
