import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { Booking } from "../models/booking.model.js";
import { Contact } from "../models/contact.model.js"; // Assuming feedback model exists
import {Delivery} from '../models/delivery.model.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
const adminDashboardData = asyncHandler(async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalDeliveries = await Delivery.countDocuments();
    const totalFeedbacks = await Contact.countDocuments();

    if (
      totalUsers === undefined ||
      totalVendors === undefined ||
      totalCategories === undefined ||
      totalProducts === undefined ||
      totalBookings === undefined ||
      totalDeliveries === undefined ||
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
          totalDeliveries,
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

// 1️Admin adds a category to a vendor with tag
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

  const adminDeleteBooking = async (req, res) => {
    try {
      const { bookingId } = req.params;
  
      const booking = await Booking.findById(bookingId);
  
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
  
      // ✅ Allow deletion only if status is 'cancelled' or 'completed'
      if (!["cancelled", "completed"].includes(booking.status)) {
        return res.status(400).json({
          message: "Only cancelled or completed bookings can be deleted by admin",
        });
      }
  
      await booking.deleteOne();
  
      return res
        .status(200)
        .json({ message: "Booking deleted successfully by admin" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  };
  
  const deleteContactById = asyncHandler(async (req, res) => {
    const { contactId } = req.params;
  
    // Find the contact
    const contact = await Contact.findById(contactId);
  
    if (!contact) {
      return res.status(404).json(
        new ApiError(404, null, "Contact not found")
      );
    }
  
    // Remove reference from user's feedbacks array
    await User.findByIdAndUpdate(contact.user, {
      $pull: { feedbacks: contact._id },
    });
  
    // Delete the contact
    await Contact.findByIdAndDelete(contactId);
  
    return res.status(200).json(
      new ApiResponse(200, null, "Contact deleted successfully")
    );
  });
  // Get All Deliveries
// Get All Deliveries
const adminDeliveryData = asyncHandler(async (req, res) => {
    try {
        const allDeliveryDetails = await Delivery.find({})
            .populate("user", "name email phone") // Populating user details
            .populate("vendor", "image name phone") // Vendor details
            .populate("product", "images title") // Product details

        if (!allDeliveryDetails || allDeliveryDetails.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No delivery data found.",
                details: ["Delivery data is currently unavailable."]
            });
        }

        console.log("Fetching admin delivery data...");

        return res.status(200).json(
            new ApiResponse(200, { allDeliveryDetails }, "All Delivery data fetched successfully!")
        );
    } catch (error) {
        return res.status(500).json(
            new ApiError(500, null, "Unable to Fetch Delivery Details")
        );
    }
});

// Delete a Delivery
const deleteDelivery = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDelivery = await Delivery.findByIdAndDelete(id);

        if (!deletedDelivery) {
            return res.status(404).json({
                status: 404,
                message: "Delivery not found.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Delivery deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Failed to delete delivery.",
        });
    }
});
// A middleware to restrict role changes
const validRoles = ["user", "team", "vendor", "admin"];

// Update a user's role by the admin
const updateUserRoleByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // 1. Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // 2. Validate role
  if (!role || !validRoles.includes(role)) {
    throw new ApiError(400, "Invalid or missing role status");
  }

  // 3. Fetch user and check if they exist
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 4. Prevent a user from changing their own role (as a safety measure)
  if (req.user._id.toString() === userId) {
    throw new ApiError(403, "You cannot change your own role");
  }

  // 5. Update the role
  user.role = role;
  await user.save({ validateBeforeSave: false }); // Bypass validation for password/email

  return res.status(200).json(
    new ApiResponse(200, user, `User role updated to '${role}' successfully`)
  );
});
export { adminDashboardData , adminUserData , adminVendorData , adminCategoryData , adminProductData , adminBookingData , adminFeedbackData , addCategoryToVendor , adminDeleteBooking , deleteContactById , adminDeliveryData , deleteDelivery , updateUserRoleByAdmin};
