import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaTimes, FaCalendarCheck, FaPowerOff } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { useUser } from "../../UserContext/userContext";
import { IoHeartCircleOutline } from "react-icons/io5";
import { FaHeart, FaStore } from "react-icons/fa6";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [forceUpdate, setForceUpdate] = useState(0);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Force re-render when user state changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [user]);

  // Don't render while loading
  if (isLoading) {
    return (
      <button
        className="absolute right-4 sm:right-8 lg:hidden text-white focus:outline-none touch-manipulation"
        disabled
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <FaBars size={24} />
      </button>
    );
  }

  const menuItems = user?._id ? [
    { to: `/user/${user._id}/account`, label: "My Account", tooltip: "My Account", icon: <FaUser /> },
    { to: `/user/${user._id}/account/wishlists`, label: "My Wishlists", tooltip: "Wishlists", icon: <FaHeart /> },
    { to: `/user/${user._id}/account/vendor-wishlists`, label: "My Vendors", tooltip: "My Wishlists", icon: <FaStore /> },
    { to: `/user/${user._id}/account/bookings`, label: "My Orders", tooltip: "Orders", icon: <FaCalendarCheck /> },
  ] : [
    { to: "/login", label: "My Account", tooltip: "Login to access account", icon: <FaUser /> },
    { to: "/login", label: "My Wishlists", tooltip: "Login to access wishlists", icon: <FaHeart /> },
    { to: "/login", label: "My Vendors", tooltip: "Login to access vendors", icon: <FaStore /> },
    { to: "/login", label: "My Orders", tooltip: "Login to access orders", icon: <FaCalendarCheck /> },
  ];

  return (
    <>
      {/* Hamburger Icon */}
      <button
        className="absolute right-4 sm:right-8 lg:hidden text-white focus:outline-none touch-manipulation"
        onClick={toggleMenu}
        onTouchStart={(e) => e.preventDefault()}
        data-aos="fade-up"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div 
          key={`user-mobile-menu-${forceUpdate}-${user?._id || 'no-user'}`}
          className="absolute top-0 right-0 w-full h-max text-white z-50 bg-gradient-to-t from-zinc-800 to-gray-900 p-6 shadow-lg transition-all duration-300 touch-manipulation"
        >
          <button 
            className="absolute top-4 right-7 sm:right-10 text-white sm:py-3 touch-manipulation" 
            onClick={toggleMenu}
            onTouchStart={(e) => e.preventDefault()}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
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
            {menuItems.map(({ to, label, icon }, index) => (
              <li key={`${to}-${index}-${forceUpdate}`} className="opacity-80 flex items-center justify-center p-2.5 gap-2.5 bg-gray-800 rounded-2xl w-60 hover:text-yellow-400">
                {icon}
                <NavLink to={to} onClick={toggleMenu}>
                  {label}
                </NavLink>
              </li>
            ))}

            {/* Button Group */}
            {user?._id ? (
              <button
                onClick={() => {
                  navigate("/logout");
                  toggleMenu();
                }}
                className="bg-red-500 px-4 py-2 rounded-lg w-48 hover:bg-red-600 flex justify-center items-center gap-2 sm:w-60"
              >
                Logout <FaPowerOff className="text-white w-5 h-5" />
              </button>
            ) : (
              <div className="flex flex-col gap-3 w-60">
                <button
                  onClick={() => {
                    navigate("/login");
                    toggleMenu();
                  }}
                  className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 flex justify-center items-center gap-2"
                >
                  Login <FaUser className="text-white w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    toggleMenu();
                  }}
                  className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 flex justify-center items-center gap-2"
                >
                  Sign Up <FaUser className="text-white w-5 h-5" />
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
