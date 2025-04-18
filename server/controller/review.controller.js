import { Review } from "../models/review.model.js";
import {User} from "../models/user.model.js"
import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const addReviewToVendor = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { id: vendorId } = req.params;
    const userId = req.user._id; // Assuming user ID is attached in the request object from middleware

    try {
        // Check if the vendor exists
        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json(
                new ApiError(404, null, "Vendor not found.")
            );
        }

        // Create a new review document
        const newReview = new Review({
            user: userId,
            vendor: vendorId,
            rating,
            comment
        });

        // Save the review
        await newReview.save();

        // Add review to vendor (optional: you may track reviews in vendor schema as well)
        vendor.reviews.push(newReview._id);
        await vendor.save();

        // Respond with success message and the review data
        return res.status(201).json(
            new ApiResponse(201, { newReview }, "Review added successfully.")
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            new ApiError(500, null, "Error adding review to vendor.")
        );
    }
});

// Fetch all reviews for a specific vendor
const getVendorReviews = asyncHandler(async (req, res) => {
    const { id: vendorId } = req.params;
  
    try {
      // Fetch all reviews for the vendor
      const reviews = await Review.find({ vendor: vendorId })
        .populate("user", "name")  // Populate user details (e.g., name)
        .select("rating comment user")  // Only select rating, comment, and user
        .sort({ createdAt: -1 }); // Optional: Sort by most recent first
  
      // If no reviews found for the vendor
      if (!reviews || reviews.length === 0) {
        return res.status(404).json(
          new ApiError(404, null, "No reviews found for this vendor.")
        );
      }
  
      // Map reviews to send relevant details: name, rating, and comment
      const reviewDetails = reviews.map((review) => ({
        name: review.user.name,  // User's name
        rating: review.rating,  // Rating given by the user
        comment: review.comment,  // Comment from the user
      }));
  
      return res.status(200).json(
        new ApiResponse(200, { reviews: reviewDetails }, "Reviews fetched successfully.")
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(
        new ApiError(500, null, "Error fetching reviews for this vendor.")
      );
    }
  });

  const getVendorReviewStats = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate vendor ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res
          .status(400)
          .json(new ApiError(400, null, "Invalid vendor ID format."));
      }
  
      // Check vendor exists
      const vendorExists = await Vendor.findById(id).select("_id");
      if (!vendorExists) {
        return res
          .status(404)
          .json(new ApiError(404, null, "Vendor not found."));
      }
  
      // Fetch all reviews for this vendor
      const reviews = await Review.find({ vendor: id }).select("rating");
  
      const totalReviews = reviews.length;
      const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = totalReviews > 0 ? (totalRatings / totalReviews).toFixed(2) : 0;
  
      return res.status(200).json(
        new ApiResponse(200, { totalReviews, avgRating }, "Vendor review stats fetched successfully.")
      );
    } catch (error) {
      console.error("Error fetching vendor review stats:", error);
      return res
        .status(500)
        .json(new ApiError(500, null, "Internal server error."));
    }
  };
export { addReviewToVendor , getVendorReviews , getVendorReviewStats };