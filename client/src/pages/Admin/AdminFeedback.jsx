import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FeedbackTable from '../../components/Admin/AdminFeedback/FeedbackTable';
import SkeletonTable from '../../components/LoadingSkeleton/SkeletonTable';
const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading , setLoading] = useState(false);
  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/feedbacks`, { withCredentials: true });
      setFeedbacks(res.data.data.allFeedbackDetails);
    } catch (err) {
      console.error('Error fetching feedback data:', err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-4">All Feedbacks</h2>
      {loading ? 
        <div className='flex justify-center items-center mt-10'>
      <SkeletonTable/> 
        </div>
        :
      <FeedbackTable feedbacks={feedbacks} />
      }
    </div>
  );
};

export default AdminFeedback;
