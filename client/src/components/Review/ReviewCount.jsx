import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdOutlineStar } from "react-icons/md";

const ReviewCount = ({ id }) => {
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor/${id}/review-stats`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setReviewCount(response.data.data.totalReviews);
          setAvgRating(response.data.data.avgRating);
        }
      } catch (error) {
        console.error("Error fetching review stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewStats();
  }, [id]);

  if (loading)
    return (
      <div className="flex mt-2 gap-4 animate-pulse">
        <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
        <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
        <div className="bg-gray-300 h-5 w-5 rounded-full"></div>
      </div>
    );

  return (
    <div className="flex items-center space-x-2 mt-2 text-gray-700">
      <MdOutlineStar className="text-yellow-400 text-2xl" />
      <span className="font-semibold text-lg">{avgRating}</span>
      <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
    </div>
  );
};

export default ReviewCount;

