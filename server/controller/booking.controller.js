import { Booking } from "../models/booking.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
const createBooking = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    const user = req.user._id;

    if (!product || !quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid input." });
    }

    const foundProduct = await Product.findById(product).populate("vendor category");
    if (!foundProduct) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const totalPrice = quantity * foundProduct.price;

    const newBooking = await Booking.create({
      user,
      vendor: foundProduct.vendor._id,
      product,
      category: foundProduct.category._id,
      quantity,
      totalPrice,
    });

    await User.findByIdAndUpdate(user, {
      $push: { bookings: newBooking._id },
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      data: newBooking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
  const getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "name email")
        .populate("vendor", "name phone")
        .populate("product", "title price")
        .populate("category", "title tag");
  
      res.status(200).json({
        success: true,
        message: "All bookings fetched successfully.",
        data: bookings,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch bookings.",
      });
    }
  };
  const getBookingConfirmation = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
  
    // Validate booking ID
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new ApiError(400, 'Invalid booking ID format.');
    }
  
    // Fetch booking with populated references
   const booking =  await Booking.findById(bookingId)
  .populate("product")
  .populate({
    path: "product",
    populate: { path: "category" },
  })
  .populate("vendor")
  .populate("user")
  .lean();

    if (!booking) {
      throw new ApiError(404, 'Booking not found.');
    }
  
    return res.status(200).json(
      new ApiResponse(200, { booking }, 'Booking confirmation details fetched successfully.')
    );
  });
  const deleteBooking = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Booking.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Booking not found.",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Booking deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  };
  
  export {createBooking , getAllBookings ,getBookingConfirmation,  deleteBooking}