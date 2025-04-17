import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserNavbar from "../../components/Navbars/UserNavbar/UserNavbar";
import UserProfile from "../../components/User/UserAccount/UserProfile";
import UserDetailsForm from "../../components/User/UserAccount/UserDetailsForm";
import UserActions from "../../components/User/UserAccount/UserActions";
import SkeletonForm from "../../components/LoadingSkeleton/SkeletonForm";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
const UserAccount = () => {
  const [showUser, setShowUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/${id}/account`,
        { withCredentials: true }
      );
      setShowUser(data.data.userInfo);
    } catch (err) {
      setError("Error fetching user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  return (
    <>
    <div className="bg-gradient-to-tl from-gray-600 to-slate-800">
      <UserNavbar />
    </div>
      <div className="bg-gray-50 h-max">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <SkeletonForm />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
            <UserProfile user={showUser} />
            <div className="flex-1 px-4 md:px-10 py-8 bg-white">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10 tracking-wide">
                  My Account
                </h2>
                {showUser ? (
                  <>
                    <UserDetailsForm user={showUser} />
                    <div className="mt-8">
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
