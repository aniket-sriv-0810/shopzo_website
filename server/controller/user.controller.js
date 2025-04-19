import { User } from "../models/user.model.js";
import {Vendor} from '../models/vendor.model.js';
import {Booking} from '../models/booking.model.js';
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
    // 🧠 Upload image to Cloudinary if provided
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (result?.url) imageURL = result.url;
    }

    // 🔍 Fetch current user
    const user = await User.findById(id);
    if (!user) return res.status(404).json(new ApiError(404, "User not found"));

    // ✅ Check for email conflict with other users
    if (email && email !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json(new ApiError(400, "Email already exists"));
      }
    }

    // ✅ Check for phone conflict with other users
    if (phone && phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json(new ApiError(400, "Phone number already exists"));
      }
    }

    // ✨ Update fields only if provided
    user.name = name ?? user.name;
    user.email = email ? email.toLowerCase() : user.email;
    user.phone = phone ?? user.phone;
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

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json(
        new ApiError(404, "User not found", "User does not exist!")
      );
    }

    // ✅ Trigger middleware cleanup
    await User.findOneAndDelete({ _id: id });

    console.log("✅ User and all related data deleted:", id);

    // 🧼 If the user deletes their own account (non-admin), clean up session
    const isSelf = req.user._id.toString() === id.toString();
    const isAdmin = req.user.role === "admin";

    if (isSelf && !isAdmin) {
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
    } else {
      return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully by admin!")
      );
    }

  } catch (error) {
    console.error("User deletion failed:", error);
    return res.status(500).json(
      new ApiError(500, "Server Error", "Failed to delete the account")
    );
  }
});


const bookProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const { sizeSelected, quantity } = req.body;

    // 1. Fetch product
    const product = await Product.findById(productId)
      .populate("vendor", "name bookings")
      .populate("category", "title");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. Validate size
    if (!product.sizes.includes(sizeSelected)) {
      return res.status(400).json({ error: "Invalid size selected" });
    }

    // 3. Calculate total price
    const totalPrice = product.discountedPrice * quantity;

    // 4. Create new booking
    const newBooking = new Booking({
      user: userId,
      vendor: product.vendor._id,
      product: product._id,
      category: product.category._id,
      sizeSelected,
      quantity,
      totalPrice,
    });

    await newBooking.save();

    // 5. Add booking to User (already done)
    await User.findByIdAndUpdate(userId, {
      $push: { bookings: newBooking._id },
    });

    // 6. Add user to product bookings
    await Product.findByIdAndUpdate(productId, {
      $addToSet: { bookings: userId },
    });

    // 7. Add user to vendor bookings
    await Vendor.findByIdAndUpdate(product.vendor._id, {
      $addToSet: { bookings: userId },
    });

    return res.status(201).json({
      message: "Booking successful!",
      booking: newBooking,
    });

  } catch (err) {
    console.error("Booking Error:", err);
    return res.status(500).json({ error: "Something went wrong while booking." });
  }
};

const getUserBookings = async (req, res) => {
  const userId = req.params.id;

  try {
    // Authorization check
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch user's bookings with populated fields
    const bookings = await Booking.find({ user: userId })
      .populate("vendor", "name email image")
      .populate("product", "title discountedPrice images")
      .populate("category", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user bookings.",
    });
  }
};


const cancelUserBooking = asyncHandler(async (req, res) => {
  const { userId, bookingId } = req.params;

  // Validate input
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid Booking ID");
  }

  // Find the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  // Make sure the booking belongs to the user
  if (booking.user.toString() !== userId) {
    throw new ApiError(403, "Unauthorized action");
  }

  // Update booking status to 'cancelled'
  booking.status = "cancelled";
  await booking.save();

  // Remove the booking from user's bookings array
  await User.findByIdAndUpdate(userId, {
    $pull: { bookings: bookingId },
  });

  // Remove the booking from product's bookings array (if applicable)
  await Product.findByIdAndUpdate(booking.product, {
    $pull: { bookings: bookingId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { bookingId }, "Booking cancelled successfully"));
});

export { userAccountDetails  , getUserWishlists , toggleProductWishlist , getUserVendorWishlists , toggleVendorWishlist ,editUserDetails , deleteUserAccount , bookProduct, getUserBookings , cancelUserBooking};
