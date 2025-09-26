import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaUser, FaBars, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { useUser } from '../../UserContext/userContext';
import WebsiteLogo from '../../../assets/black-website-logo.png';

const Header = () => {
  const [query, setQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Detecting...');
  const { user } = useUser();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    if (query.trim()) {
      // Navigate to search results page
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user's current location
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // For demo purposes, we'll use a default location
            // In a real app, you'd reverse geocode the coordinates
            setCurrentLocation('Sultanpur, UP');
          },
          (error) => {
            console.error('Error getting location:', error);
            setCurrentLocation('Location not available');
          }
        );
      } else {
        setCurrentLocation('Location not supported');
      }
    };

    getCurrentLocation();
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLocationUpdate = () => {
    // In a real app, this would open a location picker or search
    setCurrentLocation('Sultanpur, UP'); // Demo update
    
    // Show alert that service is only available in the selected location
    alert("Please note: Our service is only available in Sultanpur, UP, at this time.");
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 md:relative">
      <div className=" mx-auto px-0 sm:px-0 lg:px-0 ">
        <div className="flex items-center justify-between h-20 ">
          {/* Logo - Left Corner */}
          <div className="flex items-center">
            <NavLink 
              to="/" 
              className="flex items-center transition-transform duration-200 hover:scale-105"
            >
              <img
                src={WebsiteLogo}
                alt="The Shopzo"
                className="w-24 h-auto object-contain"
                // data-aos="fade-down"
              />
            </NavLink>
          </div>

          {/* Location Component - Only visible on desktop */}
          <div className="hidden md:flex items-center ml-6">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <FaMapMarkerAlt className="text-red-500" size={14} />
              <div className="text-left">
                <div className="font-medium">{currentLocation}</div>
                <button
                  onClick={handleLocationUpdate}
                  className="text-xs text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                >
                  Update Location
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-lg mx-4 md:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full py-2 md:py-2.5 pl-3 md:pl-5 pr-10 md:pr-14 text-sm text-gray-800 placeholder-gray-400 bg-white/70 backdrop-blur-md border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all duration-300"
              />
              <button
                onClick={handleSearch}
                className="absolute hover:cursor-pointer top-1/2 right-3 transform -translate-y-1/2 bg-gray-700 hover:bg-indigo-700 text-white p-1.5 rounded-full shadow-md transition-all duration-300"
              >
                <FaSearch size={14} />
              </button>
            </div>
          </div>

          {/* Navigation Items - Right of Search Bar - Only visible on desktop */}
          <div className="hidden lg:flex items-center space-x-6 ml-6">
            <NavLink
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </NavLink>
            
            <NavLink
              to="/categories"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              Categories
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </NavLink>
            
            <NavLink
              to="/vendors"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              Vendors
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </NavLink>
            
            <NavLink
              to="/about"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </NavLink>
            
            <NavLink
              to="/contact"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 relative group"
            >
              Connect
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 group-hover:w-full"></span>
            </NavLink>
          </div>

          {/* Heart Icon - Always visible */}
          <div className="flex items-center">
            <NavLink
              to={user ? `/user/${user._id}/account/wishlists` : "/login"}
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
            >
              <FaHeart className="w-6 h-6" />
              {/* Wishlist count badge - you can add this later */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span> */}
            </NavLink>
          </div>

          {/* Mobile Menu Button removed */}

          {/* Right Side Icons - Only visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Profile Dropdown - Only for logged in users */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 hover:border-gray-400 transition-colors duration-200"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                      <div className="py-2">
                        {/* User Info Section */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <NavLink
                            to={`/user/${user._id}/account`}
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-indigo-600 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3 group-hover:bg-indigo-500 transition-colors duration-200"></div>
                            My Account
                          </NavLink>
                          
                          {user?.role === "admin" && (
                            <NavLink
                              to="/admin/dashboard"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 hover:text-orange-600 transition-all duration-200 group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 group-hover:bg-yellow-500 transition-colors duration-200"></div>
                              Admin Dashboard
                            </NavLink>
                          )}
                          
                          {user?.role === "intern" && (
                            <NavLink
                              to="/intern/dashboard"
                              className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-200 group"
                              onClick={() => setIsProfileDropdownOpen(false)}
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-500 transition-colors duration-200"></div>
                              Intern Dashboard
                            </NavLink>
                          )}
                          
                          <NavLink
                            to="/about"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:bg-purple-500 transition-colors duration-200"></div>
                            About
                          </NavLink>
                          
                          <NavLink
                            to="/contact"
                            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-cyan-50 hover:text-teal-600 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-2 h-2 bg-teal-400 rounded-full mr-3 group-hover:bg-teal-500 transition-colors duration-200"></div>
                            Connect
                          </NavLink>
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-gray-100 pt-2">
                          <NavLink
                            to="/logout"
                            className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 group"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3 group-hover:bg-red-500 transition-colors duration-200"></div>
                            Logout
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login and Signup buttons for non-logged in users */}
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu removed - only using logo, search bar, and heart icon */}
      </div>
    </div>
  );
};

export default Header;
