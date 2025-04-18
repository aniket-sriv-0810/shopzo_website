import React, { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {  FaUser, FaBars, FaTimes,   FaPowerOff ,  FaTags } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useUser } from "../../UserContext/userContext";
import { FaBoxOpen, FaClipboardCheck } from "react-icons/fa6";


const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const {id} = useParams();

  const menuItems = [
    { to: `/vendor/${id}/account`, label: "My Account", tooltip: "Account" , icon: <FaUser />},
    { to: `/vendor/${id}/account/categories-listed`, label: "My Categories", tooltip: "Categories" , icon: <FaTags /> },
    { to: `/vendor/${id}/account/products-listed`, label: "My Products ", tooltip: "Products" , icon: <FaBoxOpen />},
    { to: `/vendor/${id}/account/bookings`, label: "My Bookings", tooltip: "Bookings" , icon: <FaClipboardCheck />},
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
            {user?.role === "vendor" && (
              <li className="opacity-80 flex items-center justify-center p-2.5 gap-2 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
                <MdAdminPanelSettings className="text-xl" />
                <NavLink to={`/vendor/${id}/account/dashboard`} onClick={toggleMenu}>
                  My Dashboard
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

           {/* Button Group */}
                    <button
                                   onClick={() => navigate("/logout")}
                                   className="bg-red-500 px-4 py-2 rounded-lg w-48 hover:bg-red-600 flex justify-center items-center gap-2 sm:w-60"
                                 >
                                   Logout <FaPowerOff className="text-white w-5 h-5" />
                                 </button>
          </ul>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
