import { Vendor } from "../models/vendor.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Category } from "../models/category.model.js";
import { Booking } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";


const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find({}).select("-password -__v");

    if (!vendors || vendors.length === 0) {
      throw new ApiError(404, "No vendors found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, vendors, "Fetched all vendors successfully"));
  } catch (error) {
    console.error("❌ Error fetching vendors:", error);
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Failed to fetch vendors"
        )
      );
  }
});


// 📦 Get Vendor Account Details Controller
const vendorAccountDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // 🛑 Validate presence of ID
    if (!id) {
      return res.status(400).json(
        new ApiError(400, "Vendor ID is required!")
      );
    }

    // 🛑 Validate proper MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(
        new ApiError(400, "Invalid ID", "Invalid Vendor ID format!")
      );
    }

    // 🔍 Fetch vendor by ID and populate related references
    const vendorInfo = await Vendor.findById(id)
      .select("-salt -hash -__v") // exclude sensitive fields added by passport-local-mongoose
      .populate("products")
      .populate("categories")
      .populate({
        path: "bookings.user",
        select: "name email"
      })
      .populate({
        path: "reviews.user",
        select: "image name email"
      })

    if (!vendorInfo) {
      return res.status(404).json(
        new ApiError(404, null, "Vendor not found!")
      );
    }

    console.log("✅ Vendor Info =>", vendorInfo);

    return res.status(200).json(
      new ApiResponse(200, { vendorInfo }, "Vendor details fetched successfully!")
    );
  } catch (error) {
    console.error("❌ Error fetching vendor details:", error);
    return res.status(500).json(
      new ApiError(500, error?.message, "Failed to fetch vendor details.")
    );
  }
});


const updateVendorById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, username, email, phone, address } = req.body;

  let vendor = await Vendor.findById(id);
  if (!vendor) {
    return res.status(404).json(new ApiError(404, "Vendor not found"));
  }

  // Check email & phone uniqueness
  if (email && email.toLowerCase() !== vendor.email) {
    const existingEmail = await Vendor.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json(new ApiError(400, "Email already exists"));
    }
  }

  if (phone && phone !== vendor.phone) {
    const existingPhone = await Vendor.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json(new ApiError(400, "Phone already exists"));
    }
  }

  let image = vendor.image;
  if (req.file) {
    const uploaded = await uploadOnCloudinary(req.file.path);
    if (uploaded?.secure_url) {
      image = uploaded.secure_url;
    }
  }

  // Update fields
  vendor.name = name;
  vendor.username = username.toLowerCase();
  vendor.email = email.toLowerCase();
  vendor.phone = phone;
  vendor.image = image;

  vendor.address = {
    area: address.area,
    city: address.city,
    pincode: address.pincode,
    state: address.state,
    country: address.country,
  };

  await vendor.save();

  return res
    .status(200)
    .json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});


const deleteVendorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiError(400, "Invalid Vendor ID!"));
  }

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    return res.status(404).json(new ApiError(404, "Vendor does not exist!"));
  }

  // Trigger middleware cleanup on delete
  await Vendor.findByIdAndDelete(id);

  return res.status(200).json(
    new ApiResponse(200, {}, "Vendor and associated data deleted successfully.")
  );
});



// 2️⃣ Fetch products by vendor, category, and tag
const getVendorProductsByCategoryAndTag = async (req, res) => {
  const { vendorId } = req.params;
  const { categoryTitle, tag } = req.query; // Ex: ?categoryTitle=hoodies&tag=male

  try {
    // Find the correct category
    const category = await Category.findOne({ title: categoryTitle, tag });
    if (!category) return res.status(404).json({ success: false, message: "Category not found." });

    // Fetch products based on vendor + category + tag
    const products = await Product.find({
      vendor: vendorId,
      category: category._id,
      tag: tag,
    }).populate("category").populate("vendor");

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching vendor's products by category and tag:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getVendorCounts = async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    const productCount = await Product.countDocuments({ vendor: vendorId });
    const categoryCount = await Category.countDocuments({
      _id: { $in: (await Product.find({ vendor: vendorId }).distinct("category")) }
    });
    const bookingCount = await Booking.countDocuments({ vendor: vendorId });

    return res.status(200).json({
      success: true,
      data: {
        productCount,
        categoryCount,
        bookingCount,
      },
    });
  } catch (err) {
    console.error("Error getting vendor counts", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor counts.",
    });
  }
};

const getVendorDashboardData = async (req, res) => {
  const vendorId = req.params.vendorId;

  try {
    const products = await Product.find({ vendor: vendorId }).populate("category");
    const bookings = await Booking.find({ vendor: vendorId }).populate("product user");

    const categoryIds = await Product.find({ vendor: vendorId }).distinct("category");
    const categories = await Category.find({ _id: { $in: categoryIds } });

    return res.status(200).json({
      success: true,
      data: {
        products,
        categories,
        bookings,
      },
    });
  } catch (err) {
    console.error("Error fetching vendor data", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vendor dashboard data.",
    });
  }
};

const vendorCategoriesData = async (req, res) => {
  const { id } = req.params;

  try {
    // Get all products for the vendor
    const products = await Product.find({ vendor: id })
      .populate("category") // no field selection, fetch full category info
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found for this vendor.",
      });
    }

    // Extract full unique category objects from products
    const uniqueCategoriesMap = new Map();

    products.forEach((product) => {
      const category = product.category;
      if (category && !uniqueCategoriesMap.has(category._id.toString())) {
        uniqueCategoriesMap.set(category._id.toString(), category);
      }
    });

    const categories = Array.from(uniqueCategoriesMap.values());

    if (categories.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No categories found for this vendor's products.",
      });
    }

    res.status(200).json({
      status: "success",
      categories,
    });
  } catch (error) {
    console.error("🔴 Error fetching vendor categories:", error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching the categories.",
    });
  }
};

const addCategoriesToVendor = async (req, res) => {
  const { vendorId } = req.params; // Vendor ID
  const { categoryIds } = req.body; // Array of category IDs selected by the vendor

  try {
    // Ensure the vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        status: "error",
        message: "Vendor not found",
      });
    }

    // Fetch the categories from the database
    const categories = await Category.find({ _id: { $in: categoryIds } });
    if (!categories || categories.length !== categoryIds.length) {
      return res.status(404).json({
        status: "error",
        message: "One or more categories not found",
      });
    }

    // Add vendor to the selected categories' vendors array
    await Category.updateMany(
      { _id: { $in: categoryIds } },
      { $addToSet: { vendors: vendorId } }
    );

    // Add selected categories to the vendor's categories array
    vendor.categories.push(...categoryIds);
    await vendor.save();

    res.status(200).json({
      status: "success",
      message: "Categories added successfully to the vendor",
      vendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong while adding categories to the vendor.",
    });
  }
};

const productOfVendorData = async (req, res) => {
  try {
    const { id: vendorId, categoryId, tag } = req.params;

    // Validate tag input
    if (!["male", "female"].includes(tag)) {
      return res.status(400).json({ error: "Invalid tag value" });
    }

    const products = await Product.find({
      vendor: vendorId,
      category: categoryId,
      tag: tag.toLowerCase(),
    })
      .populate("category", "title tag")
      .populate("vendor", "name username email image");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("Error fetching vendor/category/tag products:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

const allProductsOfVendor = async (req, res) => {
  const { id } = req.params;

  try {
    const products = await Product.find({ vendor: id })
      .populate("category", "title")
      .select("title description images originalPrice discountedPrice sizes tag category")
      .exec();

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found for this vendor.",
      });
    }

    res.status(200).json({
      status: "success",
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Error fetching products for the vendor.",
    });
  }
};


const getVendorAllBookings = asyncHandler(async (req, res) => {
  const { id: vendorId } = req.params;

  // Validate Vendor ID
  if (!vendorId || !mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new ApiError(400, "Invalid Vendor ID");
  }

  // Ensure vendor exists
  const vendorExists = await Vendor.findById(vendorId);
  if (!vendorExists) {
    throw new ApiError(404, "Vendor not found");
  }

  // Fetch all bookings related to the vendor
  const bookings = await Booking.find({ vendor: vendorId })
    .populate({
      path: "user",
      select: "name email phone",
    })
    .populate({
      path: "product",
      select: "title price image",
    })
    .select("sizeSelected quantity totalPrice status bookingDate");

  if (!bookings || bookings.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No bookings found for this vendor"));
  }

  // Format the response
  const formattedBookings = bookings.map((booking) => ({
    bookingId: booking._id,
    bookingDate: booking.bookingDate,
    paymentStatus: booking.status,
    totalPrice: booking.totalPrice,
    sizeSelected: booking.sizeSelected,
    quantity: booking.quantity,
    user: {
      name: booking.user?.name || "N/A",
      email: booking.user?.email || "N/A",
      phone: booking.user?.phone || "N/A",
    },
    product: {
      title: booking.product?.title || "N/A",
      price: booking.product?.price || 0,
      image: booking.product?.image?.[0] || "",
    },
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, formattedBookings, "Bookings fetched successfully"));
});


const updateBookingStatusByVendor = asyncHandler(async (req, res) => {
  const { bookingId, vendorId } = req.params;
  const { status } = req.body;

  // ✅ 1. Validate IDs
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new ApiError(400, "Invalid booking ID");
  }

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new ApiError(400, "Invalid vendor ID");
  }

  // ✅ 2. Validate Status
  const validStatuses = ["pending", "cancelled", "completed"];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid or missing booking status");
  }

  // ✅ 3. Fetch booking and verify ownership
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.vendor.toString() !== vendorId) {
    throw new ApiError(403, "Unauthorized: This booking doesn't belong to you");
  }

  // ✅ 4. Prevent status change once completed
  if (booking.status === "completed" && status !== "completed") {
    throw new ApiError(400, "Status cannot be reverted after completion");
  }

  // ✅ 5. No update if status is already same
  if (booking.status === status) {
    throw new ApiError(400, `Booking is already marked as '${status}'`);
  }

  // ✅ 6. Update the status
  booking.status = status;
  await booking.save();

  // ✅ 7. Populate for updated response
  const updatedBooking = await Booking.findById(bookingId)
    .populate("user", "name email phone")
    .populate("product", "title price image");

  return res.status(200).json(
    new ApiResponse(200, updatedBooking, `Booking status updated to '${status}' successfully`)
  );
});


export {getAllVendors,  vendorAccountDetails  , updateVendorById , deleteVendorById ,getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData , vendorCategoriesData ,addCategoriesToVendor , productOfVendorData , allProductsOfVendor  , getVendorAllBookings , updateBookingStatusByVendor};
