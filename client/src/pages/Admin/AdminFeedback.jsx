import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedbackTable from '../../components/Admin/AdminFeedback/FeedbackTable';
import SkeletonTable from '../../components/LoadingSkeleton/SkeletonTable';
import AdminNotAvailableLoader from "../Loaders/AdminNotAvailableLoader";
import ErrorPopup from "../../components/Popups/ErrorPopUp";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../../utils/auth";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const res = await authAxios.get('/api/admin/feedbacks');
      setFeedbacks(res.data.data.allFeedbackDetails);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/contact/${feedbackId}`, {
        withCredentials: true,
      });
      setFeedbacks(prev => prev.filter(fb => fb._id !== feedbackId));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete feedback.");
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-9">All Feedbacks Received</h2>
      {loading ? (
        <div className='flex justify-center items-center mt-10'>
          <SkeletonTable />
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-medium">
          <ErrorPopup
            message={error}
            onClose={() => {
              setError("");
              navigate("/admin");
            }}
          />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center text-gray-600 font-medium">
          <AdminNotAvailableLoader
            content={"No Feedback data Found"}
            tagline={"Oops! It looks like your feedback data is empty"}
          />
        </div>
      ) : (
        <FeedbackTable feedbacks={feedbacks} onDeleteFeedback={handleDeleteFeedback} />
      )}
    </div>
  );
};

export default AdminFeedback;
