import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../components/UserContext/userContext";

const UserAccountDelete = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setUser } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const deleteUser = async () => {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/user/${id}/account/delete`,
          { withCredentials: true }
        );

        if (response.status === 200) {
          // Clear session/local storage
          setUser(null);
          localStorage.removeItem("user");

          // Redirect to homepage with a delay or alert
          navigate("/", { replace: true });
        }
      } catch (err) {
        setError("Failed to delete the account. Please try again later.");
        console.error("Delete Error:", err);
      } finally {
        setLoading(false);
      }
    };

    deleteUser();
  }, [id, navigate, setUser]);

  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
      {loading ? (
        <p className="text-lg font-medium text-gray-700">Deleting account...</p>
      ) : error ? (
        <p className="text-red-600 font-semibold">{error}</p>
      ) : (
        <p className="text-green-600 font-semibold">Account deleted successfully. Redirecting...</p>
      )}
    </div>
  );
};

export default UserAccountDelete;
