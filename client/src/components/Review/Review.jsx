import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../UserContext/userContext";
import axios from "axios";
import ErrorPopup from "../Popups/ErrorPopUp";

const Review = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This is the vendor ID
  const { user } = useUser();

  const [review, setReview] = useState({
    rating: "5",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/vendor/${id}/review`,
        {
          user: user._id,
          vendor:id,
          rating: review.rating,
          comment: review.comment,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        setReview({ rating: "5", comment: "" });
        navigate("/review/done", { state: { returnTo: `/vendor/${id}` } });
      }
    } catch (error) {
      console.error(error);
      setError(
        error?.response?.data?.message ||
          "Failed to add your review! Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      </div>

      <div className="bg-gradient-to-b from-blue-50 to-white py-10 px-5 sm:px-20 min-h-screen flex justify-center items-center rounded-xl">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
          <h1 className="text-center text-base font-bold text-gray-700 mb-6">
            Kindly Provide Your Feedback
          </h1>

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* User Information */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={user?.image || ""}
                alt="User"
                className="w-10 h-10 xs:w-14 xs:h-14 rounded-full shadow-md"
              />
              <div>
                <h2 className="text-base font-semibold text-gray-700">
                  {user?.name?.toUpperCase() || ""}
                </h2>
                <p className="text-sm ml-2 text-gray-500">
                  {user ? `${user.email?.toLowerCase()}` : ""}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <fieldset className="starability-slot m-auto">
              {[1, 2, 3, 4, 5].map((rate) => (
                <React.Fragment key={rate}>
                  <input
                    type="radio"
                    id={`rate${rate}`}
                    name="rating"
                    value={rate}
                    onChange={handleInputChange}
                    checked={review.rating === `${rate}`}
                  />
                  <label htmlFor={`rate${rate}`}>
                    {rate} star{rate > 1 && "s"}
                  </label>
                </React.Fragment>
              ))}
            </fieldset>

            {/* Comment Box */}
            <textarea
              name="comment"
              placeholder="Enter your comment..."
              required
              value={review.comment}
              onChange={handleInputChange}
              className="w-full p-4 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-500 text-gray-800"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full border-gray-500 border-2 font-semibold px-4 py-2 text-white rounded-xl mt-4 ${
                loading
                  ? "bg-gray-800 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse text-green-400">
                    Saving Review...
                  </span>
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Review;
