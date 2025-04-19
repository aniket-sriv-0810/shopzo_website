import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Booking } from "../models/booking.model.js";
import { Contact } from "../models/contact.model.js"; // Assuming feedback model exists
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const adminDashboardData = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalFeedbacks = await Contact.countDocuments();

    if (
      totalUsers === undefined ||
      totalVendors === undefined ||
      totalCategories === undefined ||
      totalProducts === undefined ||
      totalBookings === undefined ||
      totalFeedbacks === undefined
    ) {
      return res.status(404).json({
        status: 400,
        message: "Data Not Found",
        details: ["Some dashboard data is unavailable!"],
      });
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalUsers,
          totalVendors,
          totalCategories,
          totalProducts,
          totalBookings,
          totalFeedbacks,
        },
        "Admin Dashboard Data Fetched Successfully"
      )
    );
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(400).json(
      new ApiError(400, "Failed to fetch admin dashboard data")
    );
  }
});

const adminUserData = asyncHandler(async (req, res) => {
    try {
      const allUsers = await User.find({}).select("-password"); // exclude sensitive data like password
  
      if (!allUsers || allUsers.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No Users Found",
          details: ["User data is currently unavailable"],
        });
      }
  
      console.log("Fetching all registered users...");
  
      return res.status(200).json(
        new ApiResponse(200, { users: allUsers }, "All Registered Users Fetched Successfully")
      );
    } catch (error) {
      console.error("Fetch Users Error:", error);
      return res.status(400).json(
        new ApiError(400, null, "Unable to Fetch User Details")
      );
    }
  });
  const adminVendorData = asyncHandler(async (req, res) => {
    try {
        const allVendorDetails = await Vendor.find({});

        if (!allVendorDetails) {
            return res.status(404).json({
                status: 404,
                message: "Service Unavailable",
                details: ["Vendor data is unavailable"]
            });
        }

        console.log("Fetching admin vendor data...");

        return res.status(200).json(
            new ApiResponse(200, { allVendorDetails }, "All Registered Vendors details!")
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, null, "Unable to Fetch Vendor Details")
        );
    }
});

// Get All Categories
const adminCategoryData = asyncHandler(async (req, res) => {
    try {
        const allCategoryDetails = await Category.find({});

        if (!allCategoryDetails) {
            return res.status(404).json({
                status: 404,
                message: "Service Unavailable",
                details: ["Category data is unavailable"]
            });
        }

        console.log("Fetching admin category data...");

        return res.status(200).json(
            new ApiResponse(200, { allCategoryDetails }, "All Categories data!")
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, null, "Unable to Fetch Category Details")
        );
    }
});
// Get All Products
const adminProductData = asyncHandler(async (req, res) => {
  try {
    const allProductDetails = await Product.find({})
      .populate("category")           // Get full category info
      .populate("vendor")             // Get full vendor info
      .populate("wishlists", "name email") // Just get basic info about users who wishlisted
      .populate("bookings", "name email"); // Optional: if you want users who booked

    if (!allProductDetails || allProductDetails.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No Products Found",
        details: ["Product data is unavailable or empty"]
      });
    }

    console.log("Fetching admin product data...");

    return res.status(200).json(
      new ApiResponse(200, { allProductDetails }, "All Products data retrieved successfully")
    );
  } catch (error) {
    console.error("Error fetching admin product data:", error);
    return res.status(400).json(
      new ApiError(400, null, "Unable to Fetch Product Details")
    );
  }
});
// Get All Bookings
const adminBookingData = asyncHandler(async (req, res) => {
    try {
        const allBookingDetails = await Booking.find({})
        .populate("user", "name email phone") // Populating only the necessary fields for user
        .populate("vendor", "image name phone") // Vendor details
        .populate("product", "images title") // Product details
        .populate("category", "title"); // Category details

        if (!allBookingDetails) {
            return res.status(404).json({
                status: 404,
                message: "Service Unavailable",
                details: ["Booking data is unavailable"]
            });
        }

        console.log("Fetching admin booking data...");

        return res.status(200).json(
            new ApiResponse(200, { allBookingDetails }, "All Bookings data!")
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, null, "Unable to Fetch Booking Details")
        );
    }
});// Get All Feedbacks
const adminFeedbackData = asyncHandler(async (req, res) => {
    try {
        const allFeedbackDetails = await Contact.find({})
            .populate("user");

        if (!allFeedbackDetails) {
            return res.status(404).json({
                status: 404,
                message: "Service Unavailable",
                details: ["Feedback data is unavailable"]
            });
        }

        console.log("Fetching admin feedback data...");

        return res.status(200).json(
            new ApiResponse(200, { allFeedbackDetails }, "All Feedbacks data!")
        );
    } catch (error) {
        return res.status(400).json(
            new ApiError(400, null, "Unable to Fetch Feedback Details")
        );
    }
});

// 1️⃣ Admin adds a category to a vendor with tag
const addCategoryToVendor = async (req, res) => {
    const { vendorId } = req.params;
    const { title, description, image, tag } = req.body;
  
    try {
      // Ensure vendor exists
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) return res.status(404).json({ success: false, message: "Vendor not found." });
  
      // Check if category with same title and tag exists
      let category = await Category.findOne({ title, tag });
  
      // If not, create it
      if (!category) {
        category = new Category({ title, description, image, tag });
        await category.save();
      }
  
      // Add category to vendor if not already added
      if (!vendor.categories.includes(category._id)) {
        vendor.categories.push(category._id);
        await vendor.save();
      }
  
      return res.status(200).json({
        success: true,
        message: "Category added to vendor successfully.",
        category,
        vendorId: vendor._id,
      });
    } catch (error) {
      console.error("Error adding category to vendor:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
export { adminDashboardData , adminUserData , adminVendorData , adminCategoryData , adminProductData , adminBookingData , adminFeedbackData , addCategoryToVendor};
