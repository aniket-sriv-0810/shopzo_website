import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import UserProfile from "../../components/User/UserAccount/UserProfile";
import UserDetailsForm from "../../components/User/UserAccount/UserDetailsForm";
import UserActions from "../../components/User/UserAccount/UserActions";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useUser } from "../../components/UserContext/userContext";

const UserAccount = () => {
  const [showUser, setShowUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: userLoading } = useUser();

  // Debug logging
  console.log("🔍 UserAccount Debug:");
  console.log("URL param id:", id);
  console.log("Context user:", user);
  console.log("Context user ID:", user?._id);
  console.log("User loading:", userLoading);

  const fetchUserDetails = async () => {
    setLoading(true);
    console.log("🔍 Fetching user details for ID:", id);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${id}/account`,
        { withCredentials: true }
      );
      console.log("✅ User details fetched:", data);
      setShowUser(data.data.userInfo);
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
      console.error("❌ Error response:", err.response?.data);
      setError("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userLoading && id) {
      fetchUserDetails();
    }
  }, [id, userLoading]);

  // Redirect if user is not authenticated or accessing wrong account
  useEffect(() => {
    if (!userLoading && !user) {
      navigate("/login");
    } else if (!userLoading && user && user._id !== id) {
      navigate(`/user/${user._id}/account`);
    }
  }, [user, userLoading, id, navigate]);

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SkeletonForm />
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
        <UserNavbar />
      </div>
      <div className="bg-gray-50 min-h-screen">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <SkeletonForm />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
            <UserProfile user={showUser} />
            <div className="flex-1 px-4 md:px-10 py-8 bg-white">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-6 md:mb-10 tracking-wide">
                  My Account
                </h2>
                {showUser ? (
                  <>
                    <UserDetailsForm user={showUser} />
                    <div className="mt-6 md:mt-8">
                      <UserActions navigate={navigate} />
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 text-lg">User details not found.</p>
                )}
                {/* Error Popup for any kind of error */}
                {error && !loading && (
                  <ErrorPopup
                    message={error}
                    onClose={() => {
                      setError("");
                      navigate("/"); // Optional: redirect or reload logic
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAccount;
