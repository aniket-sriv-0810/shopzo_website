import { User } from "../models/user.model.js";
import {Vendor} from '../models/vendor.model.js';
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


// 👤 User Account Details Controller (/api/user/:id/account)
const userAccountDetails = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // 🛑 Validate ID presence
    if (!id) {
      return res.status(400).json(
        new ApiError(400, "User ID is required!")
      );
    }

    // 🛑 Validate proper Mongo ObjectID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new ApiError(400, "Invalid ID", "Invalid ID! Failed to fetch user details.")
      );
    }

    // 🔍 Find user by ID and exclude sensitive fields like password hash/salt
    const userInfo = await User.findById(id).select("-salt -hash -__v");

    // ❌ If no user found
    if (!userInfo) {
      return res.status(404).json(
        new ApiError(404, null, "User not found!")
      );
    }

    console.log("✅ User Info =>", userInfo);

    // ✅ Success response
    return res
      .status(200)
      .json(new ApiResponse(200, { userInfo }, "User details fetched successfully!"));
  } catch (error) {
    console.error("❌ Error fetching user details:", error);
    return res.status(500).json(
      new ApiError(500, error?.message, "Failed to fetch user details.")
    );
  }
});

// 🧾 Get all Wishlist Products for a User
const getUserWishlists = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      // ✅ Validate ID presence
      if (!id) {
        return res.status(400).json(
          new ApiError(400, "User ID is required!")
        );
      }
  
      // ✅ Validate ID format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json(
          new ApiError(400, "Invalid ID", "Invalid User ID format!")
        );
      }
  
      // 🔍 Find user with populated wishlist product details
      const user = await User.findById(id)
        .populate({
          path: "wishlists",
          populate: {
            path: "category", // optional: if you want full info
            select: "-__v", // customize as needed
          },
          select: "-__v", // remove unwanted fields from product
        })
        .select("wishlists");
  
      // ❌ If no user or no wishlists
      if (!user || !user.wishlists || user.wishlists.length === 0) {
        return res.status(200).json(
          new ApiResponse(200, { wishlists: [] }, "No products in wishlist.")
        );
      }
  
      console.log("✅ Wishlist products:", user.wishlists);
  
      // ✅ Success
      return res.status(200).json(
        new ApiResponse(200, { wishlists: user.wishlists }, "User wishlist fetched successfully.")
      );
    } catch (error) {
      console.error("❌ Error fetching wishlist:", error);
      return res.status(500).json(
        new ApiError(500, error.message || "Something went wrong", "Internal Server Error")
      );
    }
  });

  // 🔁 Add / Remove Product from User Wishlist
const toggleProductWishlist = asyncHandler(async (req, res) => {
    const { id } = req.params;           // user id
    const { productId } = req.body;      // product id
  
    try {
      // ✅ Validate inputs
      if (!id || !productId) {
        return res.status(400).json(
          new ApiError(400, "User ID and Product ID are required!")
        );
      }
  
      if (
        !mongoose.Types.ObjectId.isValid(id) ||
        !mongoose.Types.ObjectId.isValid(productId)
      ) {
        return res.status(400).json(
          new ApiError(400, "Invalid ID", "Invalid User or Product ID!")
        );
      }
  
      // 🔍 Find user and product
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json(new ApiError(404, "User not found"));
      }
  
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json(new ApiError(404, "Product not found"));
      }
  
      // 🧠 Toggle Wishlist (Add/Remove from both sides)
      const userIndex = user.wishlists.indexOf(productId);
      const productIndex = product.wishlists.indexOf(id);
  
      if (userIndex === -1) {
        // Add
        user.wishlists.push(productId);
        product.wishlists.push(id);
      } else {
        // Remove
        user.wishlists.splice(userIndex, 1);
        product.wishlists.splice(productIndex, 1);
      }
  
      // 💾 Save updates
      await user.save();
      await product.save();
  
      return res.status(200).json(
        new ApiResponse(200, { wishlists: user.wishlists }, "Wishlist updated successfully!")
      );
    } catch (error) {
      console.error("❌ Wishlist toggle error:", error);
      return res.status(500).json(
        new ApiError(500, error.message || "Something went wrong", "Internal Server Error")
      );
    }
  });
  
// 🧾 Get all Vendor Wishlists for a User
 const getUserVendorWishlists = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiError(400, "Invalid or missing User ID"));
  }

  const user = await User.findById(id)
    .populate({
      path: "vendorWishlists",
      select: "-__v -createdAt -updatedAt", // customize fields
    })
    .select("vendorWishlists");

  if (!user || !user.vendorWishlists?.length) {
    return res.status(200).json(new ApiResponse(200, { vendorWishlists: [] }, "No vendors in wishlist."));
  }

  return res.status(200).json(new ApiResponse(200, { vendorWishlists: user.vendorWishlists }, "Vendor wishlist fetched successfully."));
});

// 🔁 Add / Remove Vendor from Wishlist
 const toggleVendorWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;           // user ID
  const { vendorId } = req.body;       // vendor ID

  if (!id || !vendorId || 
      !mongoose.Types.ObjectId.isValid(id) || 
      !mongoose.Types.ObjectId.isValid(vendorId)) {
    return res.status(400).json(new ApiError(400, "Invalid or missing User/Vendor ID"));
  }

  const user = await User.findById(id);
  const vendor = await Vendor.findById(vendorId);

  if (!user) return res.status(404).json(new ApiError(404, "User not found"));
  if (!vendor) return res.status(404).json(new ApiError(404, "Vendor not found"));

  const userIndex = user.vendorWishlists.indexOf(vendorId);
  const vendorIndex = vendor.vendor_wishlists.indexOf(id);

  if (userIndex === -1) {
    user.vendorWishlists.push(vendorId);
    vendor.vendor_wishlists.push(id);
  } else {
    user.vendorWishlists.splice(userIndex, 1);
    vendor.vendor_wishlists.splice(vendorIndex, 1);
  }

  await user.save();
  await vendor.save();

  return res.status(200).json(
    new ApiResponse(200, { vendorWishlists: user.vendorWishlists }, "Vendor wishlist updated successfully!")
  );
});
// ✏️ Edit User Controller
const editUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(new ApiError(400, "Invalid user ID"));
    }
  
    const { name, email, phone } = req.body;
    let imageURL;
  
    try {
      // 🧠 Upload new image if exists
      if (req.file) {
        const result = await uploadOnCloudinary(req.file.path);
        if (result?.url) imageURL = result.url;
      }
  
      // 🔍 Find the user
      const user = await User.findById(id);
      if (!user) return res.status(404).json(new ApiError(404, "User not found"));
  
      // ✅ Check if new email or phone already exist (excluding self)
      if (email && email !== user.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken && emailTaken._id.toString() !== id) {
          return res.status(400).json(new ApiError(400, "Email already exists"));
        }
      }
  
      if (phone && phone !== user.phone) {
        const phoneTaken = await User.findOne({ phone });
        if (phoneTaken && phoneTaken._id.toString() !== id) {
          return res.status(400).json(new ApiError(400, "Phone number already exists"));
        }
      }
  
      // ✨ Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      if (imageURL) user.image = imageURL;
  
      await user.save();
  
      return res.status(200).json(
        new ApiResponse(200, { updatedUser: user }, "User updated successfully")
      );
    } catch (error) {
      console.error("User edit error:", error);
      return res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
  });

// DELETE - User Account Controller
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new ApiError(400, "Invalid ID", "Invalid User ID!")
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json(
        new ApiError(404, "User not found", "User does not exist!")
      );
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    console.log("User deleted successfully:", id);

    // Logout user after deletion
    req.logout((err) => {
      if (err) {
        return res.status(500).json(
          new ApiError(500, err, "Failed to log out after deletion!")
        );
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json(
            new ApiError(500, err, "Failed to destroy session!")
          );
        }

        res.clearCookie("connect.sid");
        return res.status(200).json(
          new ApiResponse(200, null, "User deleted and logged out successfully!")
        );
      });
    });

  } catch (error) {
    console.error("User deletion failed:", error);
    return res.status(500).json(
      new ApiError(500, "Server Error", "Failed to delete the account")
    );
  }
});

const getUserBookings = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(
      new ApiError(400, "User ID is required!")
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(
      new ApiError(400, "Invalid User ID!", "Failed to fetch user bookings.")
    );
  }

  const user = await User.findById(id).populate({
    path: "bookings",
    model: "Product",
    populate: {
      path: "category vendor",
      select: "title name", // customize as needed
    },
  });

  if (!user || !user.bookings.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "No bookings found for this user.")
    );
  }

  return res.status(200).json(
    new ApiResponse(200, user.bookings, "User bookings fetched successfully.")
  );
});

const cancelUserBooking = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  // Validate input
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new ApiError(400, "Invalid User ID"));
  }

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json(new ApiError(400, "Invalid Booking/Product ID"));
  }

  // Find user
  const user = await User.findById(userId);
  if (!user || !user.bookings.includes(productId)) {
    return res.status(404).json(new ApiError(404, "Booking not found for this user"));
  }

  // Remove booking from user
  await User.findByIdAndUpdate(userId, { $pull: { bookings: productId } });

  // Remove user from product's bookings
  await Product.findByIdAndUpdate(productId, { $pull: { bookings: userId } });

  console.log(`Booking with productId ${productId} cancelled for user ${userId}`);

  return res.status(200).json(
    new ApiResponse(200, {}, "Booking cancelled successfully.")
  );
});
export { userAccountDetails  , getUserWishlists , toggleProductWishlist , getUserVendorWishlists , toggleVendorWishlist ,editUserDetails , deleteUserAccount , getUserBookings , cancelUserBooking};
