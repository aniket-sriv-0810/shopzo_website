import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext/userContext";
import { authAxios } from "../../utils/auth";
import Navbar from "../../components/Navbars/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaIdCard, 
  FaEdit, 
  FaKey, 
  FaTrashAlt,
  FaSignOutAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShoppingBag,
  FaHeart,
  FaStore
} from "react-icons/fa";

const UserAccount = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: contextUser, isLoading: contextLoading, logout } = useUser();
  
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      // Check if user is authenticated
      if (!contextUser || !contextUser._id) {
        setError("Please log in to access your account");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Check if the requested user ID matches the logged-in user
      if (contextUser._id !== id) {
        setError("You can only access your own account");
        setTimeout(() => navigate(`/user/${contextUser._id}/account`), 2000);
        return;
      }

      try {
        setLoading(true);
        const response = await authAxios.get(
          `/api/user/${id}/account`
        );

        if (response.status === 200) {
          setUserDetails(response.data.data.user);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 403) {
          setError("Access denied. You can only view your own account");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setError("Failed to load account details. Please try again later");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!contextLoading) {
      fetchUserDetails();
    }
  }, [id, contextUser, contextLoading, navigate]);

  // Load data based on active tab
  useEffect(() => {
    if (!contextUser?._id) return;
    
    // No need to fetch data here since we're navigating to separate pages
  }, [contextUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const handleEditProfile = () => {
    navigate(`/user/${id}/account/edit`);
  };

  const handleChangePassword = () => {
    navigate(`/user/${id}/account/change-password`);
  };

  const handleDeleteAccount = () => {
    navigate(`/user/${id}/account/delete`);
  };

  if (contextLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
            <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const displayUser = userDetails || contextUser;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                {displayUser?.image ? (
                  <img
                    src={displayUser.image}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <FaUser className="text-3xl md:text-4xl text-white/80" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {displayUser?.name || "User"}
                </h1>
                <p className="text-blue-100 mb-2">{displayUser?.email}</p>
                {displayUser?.phone && (
                  <p className="text-blue-100">{displayUser.phone}</p>
                )}
                <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">
                  <span className="capitalize">{displayUser?.role || "User"} Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Account Information - Always Visible */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Account Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaIdCard className="text-gray-400" />
                      User ID
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-sm font-mono text-gray-600">
                        {displayUser?._id || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      Full Name
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-800 capitalize">
                        {displayUser?.name || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaEnvelope className="text-gray-400" />
                      Email Address
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-800">
                        {displayUser?.email || "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                      <FaPhone className="text-gray-400" />
                      Phone Number
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-800">
                        {displayUser?.phone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Account Status
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${displayUser?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm font-medium ${displayUser?.isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {displayUser?.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Member Since
                      </label>
                      <span className="text-sm text-gray-600">
                        {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Sections */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Sections
                  </h3>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/user/${contextUser._id}/account/bookings`)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FaShoppingBag />
                      Order History
                    </button>

                    <button
                      onClick={() => navigate(`/user/${contextUser._id}/account/wishlists`)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FaHeart />
                      Product Wishlist
                    </button>

                    <button
                      onClick={() => navigate(`/user/${contextUser._id}/account/vendor-wishlists`)}
                      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <FaStore />
                      Vendor Wishlist
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <FaEdit />
                      Edit Profile
                    </button>

                    <button
                      onClick={handleChangePassword}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <FaKey />
                      Change Password
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                    >
                      <FaTrashAlt />
                      Delete Account
                    </button>
                  </div>
                </div>

                {/* Account Security */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Security
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Email Verified</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">
                        <strong>Security Tip:</strong> Regularly update your password and keep your account information current.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area - Removed tab content since we now navigate to separate pages */}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserAccount;