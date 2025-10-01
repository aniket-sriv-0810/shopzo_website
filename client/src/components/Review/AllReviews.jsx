import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReviewCard from './ReviewCard';
import Pagination from '../Pagination/Pagination'; // Adjust the path to your pagination component
import { authAxios } from "../../utils/auth";

const AllReviews = ({ vendorId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await authAxios.get(`/api/vendor/${vendorId}/reviews`);
        setReviews(response.data.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [vendorId]);

  // Pagination logic
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
   
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-16">Loading reviews...</p>;
  }

  return (
    <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <h2 className="text-center text-2xl font-bold text-gray-800 mb-10">
        Our Testimonials
      </h2>

      {currentReviews.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {currentReviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>

          <div className="mt-10">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          No Reviews Available at this moment for this vendor.
        </p>
      )}
    </div>
  );
};

export default AllReviews;
