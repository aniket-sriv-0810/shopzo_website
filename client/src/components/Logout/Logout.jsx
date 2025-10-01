import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext/userContext";
import { auth } from "../../utils/auth";
import SkeletonForm from '../LoadingSkeleton/SkeletonForm'
const Logout = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const result = await auth.logout();

        if (result.success) {
          setUser(null);
          navigate("/"); // Redirect to homepage or login page
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("❌ Failed to logout:", error.message);
        // Even if logout fails, clear local state
        setUser(null);
        navigate("/");
      }
    };

    logoutUser();
  }, [setUser, navigate]);

  return (
    <> 
    <div className="flex justify-center items-center mt-10">
      <SkeletonForm/>
    </div>
    </>
  );
};

export default Logout;
