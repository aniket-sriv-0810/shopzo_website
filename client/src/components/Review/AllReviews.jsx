import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewCard from './ReviewCard';

const AllReviews = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/vendor/${vendorId}/all-reviews`,
          { withCredentials: true }
        );
        setReviews(response.data.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading reviews...</p>;
  }

  return (
    <div className="my-20 flex flex-wrap gap-6 justify-center py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="w-64">
            <ReviewCard review={review} />
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          No Reviews Available at this moment for this vendor.
        </p>
      )}
    </div>
  );
};

export default AllReviews;
