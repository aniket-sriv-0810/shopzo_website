import { Vendor } from "../models/vendor.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { Category } from "../models/category.model.js";
import { Booking } from "../models/booking.model.js";
import { Delivery } from "../models/delivery.model.js";
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

  // 1. Delete the Vendor
  await Vendor.findByIdAndDelete(id);

  // 2. Delete the corresponding User with the same email and role "vendor"
  await User.findOneAndDelete({ email: vendor.email, role: "vendor" });

  return res.status(200).json(
    new ApiResponse(200, {}, "Vendor and corresponding user deleted successfully.")
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
      path: "vendor",
      select: "name email phone image",
    })
    .populate({
      path: "user",
      select: "id name email phone image",
    })
    .populate({
      path: "product",
      select: "id title price images",
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
      _id: booking.user?._id,
      name: booking.user?.name || "N/A",
      email: booking.user?.email || "N/A",
      phone: booking.user?.phone || "N/A",
      image: booking.user?.image || "N/A",
    },
    vendor: {
      name: booking.vendor?.name || "N/A",
      email: booking.vendor?.email || "N/A",
      phone: booking.vendor?.phone || "N/A",
      image: booking.vendor?.image || "N/A",
    },
    product: {
      _id: booking.product?._id,
      title: booking.product?.title || "N/A",
      price: booking.product?.price || 0,
      image: booking.product?.images?.[0] || "",
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
const vendorDeleteBooking = async (req, res) => {
  try {
    const { bookingId, userId, productId } = req.params;
    const vendorId = req.user._id; // assuming vendor is authenticated and `req.user` has the vendor info

    const booking = await Booking.findOne({
      _id: bookingId,
      vendor: vendorId,
      user: userId,
      product: productId,
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found or unauthorized" });

    if (!["cancelled", "completed"].includes(booking.status)) {
      return res.status(400).json({
        message: "Only cancelled or completed bookings can be deleted by vendor",
      });
    }

    await booking.deleteOne();

    return res.status(200).json({ message: "Booking deleted by vendor" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProductPrices = async (req, res) => {
  const { productId, vendorId } = req.params;
  const { originalPrice, discountedPrice } = req.body;

  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new ApiError(400, "Invalid Product ID or Vendor ID");
  }

  try {
    // Find product and verify ownership
    const product = await Product.findOne({ _id: productId, vendor: vendorId });

    if (!product) {
      throw new ApiError(404, "Product not found or not owned by vendor");
    }

    // Validate prices
    if (discountedPrice >= originalPrice) {
      throw new ApiError(400, "Discounted price must be less than original price");
    }

    // Update prices
    product.originalPrice = originalPrice;
    product.discountedPrice = discountedPrice;

    await product.save();

    return res.status(200).json(
      new ApiResponse(200, product, "Product prices updated successfully")
    );
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "Something went wrong",
    });
  }
};
// Get all delivery details for a vendor
const getVendorAllDeliveries = asyncHandler(async (req, res) => {
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

  // Fetch all deliveries related to the vendor
  const deliveries = await Delivery.find({ vendor: vendorId })
    .populate({
      path: "vendor",
      select: "name email phone image",
    })
    .populate({
      path: "user",
      select: "id name email phone image",
    })
    .populate({
      path: "product",
      select: "id title price images",
    })
    .select("sizeSelected quantity totalPrice status createdAt");

  if (!deliveries || deliveries.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No deliveries found for this vendor"));
  }

  // Format the response
  const formattedDeliveries = deliveries.map((delivery) => ({
    deliveryId: delivery._id,
    orderDate: delivery.createdAt,
    paymentStatus: delivery.status,
    totalPrice: delivery.totalPrice,
    sizeSelected: delivery.sizeSelected,
    quantity: delivery.quantity,
    user: {
      _id: delivery.user?._id,
      name: delivery.user?.name || "N/A",
      email: delivery.user?.email || "N/A",
      phone: delivery.user?.phone || "N/A",
      image: delivery.user?.image || "N/A",
    },
    vendor: {
      name: delivery.vendor?.name || "N/A",
      email: delivery.vendor?.email || "N/A",
      phone: delivery.vendor?.phone || "N/A",
      image: delivery.vendor?.image || "N/A",
    },
    product: {
      _id: delivery.product?._id,
      title: delivery.product?.title || "N/A",
      price: delivery.product?.price || 0,
      image: delivery.product?.images?.[0] || "",
    },
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(200, formattedDeliveries, "Deliveries fetched successfully")
    );
});

// Update a delivery's status by the vendor
const updateDeliveryStatusByVendor = asyncHandler(async (req, res) => {
  const { deliveryId, vendorId } = req.params;
  const { status } = req.body;

  // 1. Validate IDs
  if (!mongoose.Types.ObjectId.isValid(deliveryId)) {
    throw new ApiError(400, "Invalid delivery ID");
  }

  if (!mongoose.Types.ObjectId.isValid(vendorId)) {
    throw new ApiError(400, "Invalid vendor ID");
  }

  // 2. Validate Status
  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid or missing delivery status");
  }

  // 3. Fetch delivery and verify ownership
  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    throw new ApiError(404, "Delivery not found");
  }

  if (delivery.vendor.toString() !== vendorId) {
    throw new ApiError(403, "Unauthorized: This delivery doesn't belong to you");
  }

  // 4. Prevent status change once delivered
  if (delivery.status === "delivered" && status !== "delivered") {
    throw new ApiError(400, "Status cannot be reverted after delivery");
  }

  // 5. No update if status is already the same
  if (delivery.status === status) {
    throw new ApiError(400, `Delivery is already marked as '${status}'`);
  }

  // 6. Update the status
  delivery.status = status;
  await delivery.save();

  // 7. Populate for updated response
  const updatedDelivery = await Delivery.findById(deliveryId)
    .populate("user", "name email phone")
    .populate("product", "title price image");

  return res.status(200).json(
    new ApiResponse(200, updatedDelivery, `Delivery status updated to '${status}' successfully`)
  );
});

// Delete a cancelled or completed delivery by the vendor
const vendorDeleteDelivery = asyncHandler(async (req, res) => {
  const { deliveryId, userId, productId } = req.params;
  const vendorId = req.user._id;

  const delivery = await Delivery.findOne({
    _id: deliveryId,
    vendor: vendorId,
    user: userId,
    product: productId,
  });

  if (!delivery) {
    throw new ApiError(404, "Delivery not found or unauthorized");
  }

  if (!["cancelled", "delivered"].includes(delivery.status)) {
    throw new ApiError(400, "Only cancelled or delivered deliveries can be deleted by vendor");
  }

  await delivery.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, "Delivery deleted by vendor"));
});



export {getAllVendors,  vendorAccountDetails  , updateVendorById , deleteVendorById ,getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData , vendorCategoriesData ,addCategoriesToVendor , productOfVendorData , allProductsOfVendor  , getVendorAllBookings , updateBookingStatusByVendor , vendorDeleteBooking , updateProductPrices , getVendorAllDeliveries,
  updateDeliveryStatusByVendor,
  vendorDeleteDelivery,};
