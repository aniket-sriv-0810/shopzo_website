import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {  FaUser, FaBars, FaTimes , FaPowerOff  } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useUser } from "../../UserContext/userContext";
import { FaBoxOpen, FaClipboardList, FaComments, FaStore, FaTags } from "react-icons/fa6";
import { IoBagAdd, IoPersonAdd } from "react-icons/io5";


const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);


  const menuItems = [
    { to: "/admin", label: "Admin Panel", tooltip: "Admin" ,icon: <MdAdminPanelSettings />, role: "admin" },
    { to: "users", label: "Users Details", tooltip: "Users"  , icon: <FaUser />},
    { to: "vendors", label: "Vendors Details", tooltip: "Vendors" ,icon: <FaStore /> },
    { to: "categories", label: "Categories Details", tooltip: "Categories" , icon: <FaTags /> },
    { to: "products", label: "Products Details", tooltip: "Products" , icon: <FaBoxOpen />},
    { to: "bookings", label: "Orders Details", tooltip: "Orders" , icon: <FaClipboardList />},
    { to: "feedbacks", label: "Feedbacks Details", tooltip: "Feedbacks" , icon: <FaComments />},
  ];

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="absolute right-4 sm:right-8 2xl:hidden text-white focus:outline-none "
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
            {menuItems.map(({ to, label, icon }) => (
              <li key={to} className="opacity-80 flex items-center justify-center p-2.5 gap-2.5 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
                {icon}
                <NavLink to={to} onClick={toggleMenu}>
                  {label}
                </NavLink>
              </li>
            ))}

           {/* Button Group */}
           
             <button
              onClick={() => navigate("add-category")}
              className="w-52 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-fuchsia-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-fuchsia-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-fuchsia-400 hover:cursor-pointer hover:scale-110"
            >
              <span className="z-10">Add Category</span>
              <FaTags  className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />
            
              {/* Optional subtle glow on hover */}
              <span className="absolute inset-0 rounded-xl bg-fuchsia-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
            </button>
           
            <button
              onClick={() => navigate("add-vendor")}
              className="w-52 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-green-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-green-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer hover:scale-110"
            >
              <span className="z-10">Add Vendors</span>
              <IoPersonAdd  className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />
            
              {/* Optional subtle glow on hover */}
              <span className="absolute inset-0 rounded-xl bg-green-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
            </button>
            <button
              onClick={() => navigate("add-product")}
              className="w-52 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-amber-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-amber-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 hover:cursor-pointer hover:scale-110"
            >
              <span className="z-10">Add Products</span>
              <IoBagAdd  className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />
            
              {/* Optional subtle glow on hover */}
              <span className="absolute inset-0 rounded-xl bg-amber-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
            </button>
            <button
              onClick={() => navigate("/logout")}
              className="w-52 group relative inline-flex items-center justify-center gap-2 px-4 py-3 text-sm md:text-base font-semibold rounded-xl bg-red-600/70 text-white backdrop-blur-md shadow-lg hover:shadow-xl hover:bg-red-700/80 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-400 hover:cursor-pointer hover:scale-110"
            >
              <span className="z-10">Log out</span>
              <FaPowerOff  className="w-5 h-5 md:w-6 md:h-6 text-white z-10" />
            
              {/* Optional subtle glow on hover */}
              <span className="absolute inset-0 rounded-xl bg-red-600 opacity-0 group-hover:opacity-10 transition-all duration-300" />
            </button>

          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
