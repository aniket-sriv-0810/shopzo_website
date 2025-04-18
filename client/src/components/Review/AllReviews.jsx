import React from 'react';
import ReviewCard from './ReviewCard';

const AllReviews = ({ reviews }) => {
  return (
    <div 
      className="my-20 flex flex-wrap gap-6 xs:gap-7 lg:gap-10 justify-center py-20 px-4 xs:px-5 bg-gradient-to-b from-gray-50 to-white" 
      data-aos="fade-up"
    >
      {reviews ? reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="w-64">
            <ReviewCard review={review} />
          </div>
        ))
      ) : (
        <p className="text-center flex justify-center items-center text-gray-600 font-normal">
          No Reviews Available at this moment for this vendor. Be the first one to share your experience with us!
        </p>
      ) : <p className="text-center flex justify-center items-center text-gray-600 font-normal">
          No Reviews Available at this moment for this vendor. Be the first one to share your experience with us!
        </p>}
    </div>
  );
};

export default AllReviews;
