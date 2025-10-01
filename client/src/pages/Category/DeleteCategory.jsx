import React, { useEffect, useState } from "react";
import { authAxios } from "../../utils/auth";
import { useNavigate, useParams } from "react-router-dom";
import SkeletonCard from "../../components/LoadingSkeleton/SkeletonCard";
import ErrorPopup from "../../components/Popups/ErrorPopUp";

const DeleteCategory = () => {
  const { id } = useParams(); // assuming id is in the URL like /admin/category/:id/delete
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDelete = async () => {
      try {
        const response = await authAxios.delete(`/api/admin/category/${id}/delete`);
        // ✅ Redirect after successful delete
        navigate("/admin/categories");
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to delete category details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      handleDelete();
    } else {
      setError("Invalid category ID");
      setLoading(false);
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 font-medium">
        <ErrorPopup
          message={error}
          onClose={() => {
            setError("");
            navigate("/admin/categories"); // Redirect back
          }}
        />
      </div>
    );
  }

  return null; // nothing visible on success — since user gets redirected
};

export default DeleteCategory;
