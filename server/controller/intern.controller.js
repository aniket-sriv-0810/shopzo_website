import { Vendor } from "../models/vendor.model.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Get all vendors for intern management
const getAllVendorsForIntern = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find({})
      .select("-password -__v")
      .populate("categories", "title tag")
      .populate("products", "title originalPrice discountedPrice images");

    return res.status(200).json(
      new ApiResponse(200, vendors, "All vendors fetched successfully for intern management")
    );
  } catch (error) {
    console.error("Error fetching vendors for intern:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to fetch vendors")
    );
  }
});

// Create new vendor (intern can add vendors)
const createVendorByIntern = asyncHandler(async (req, res) => {
  try {
    const { name, username, email, phone, image } = req.body;

    // Address can come as object or JSON string from multipart/form-data
    let address = req.body.address;
    if (typeof address === "string") {
      try {
        address = JSON.parse(address);
      } catch (e) {
        return res.status(400).json(
          new ApiError(400, "Invalid address format. Must be JSON object or object fields.")
        );
      }
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }]
    });

    if (existingVendor) {
      return res.status(400).json(
        new ApiError(400, "Vendor with this email or username already exists")
      );
    }

    // Upload image if provided
    let imageUrl = image;
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded?.secure_url) {
        imageUrl = uploaded.secure_url;
      }
    }

    // Create new vendor
    const newVendor = new Vendor({
      name,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone,
      address: {
        area: address?.area,
        city: address?.city,
        pincode: address?.pincode,
        state: address?.state,
        country: address?.country,
      },
      image: imageUrl || "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
    });

    // Set password (you might want to generate a random password and send it via email)
    const defaultPassword = "vendor123"; // You should generate a secure password
    await newVendor.setPassword(defaultPassword);
    await newVendor.save();

    // Create corresponding user account
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      phone,
      image: imageUrl || "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
      role: "vendor",
    });

    await newUser.setPassword(defaultPassword);
    await newUser.save();

    return res.status(201).json(
      new ApiResponse(201, { vendor: newVendor, user: newUser }, "Vendor created successfully by intern")
    );
  } catch (error) {
    console.error("Error creating vendor by intern:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to create vendor")
    );
  }
});

// Add product to vendor (intern can add products for vendors)
const addProductToVendor = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;
    let {
      title,
      description,
      originalPrice,
      discountedPrice,
      sizes,
      category,
      tag,
    } = req.body;

    // Validate vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json(
        new ApiError(404, "Vendor not found")
      );
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json(
        new ApiError(404, "Category not found")
      );
    }

    // Parse and validate pricing
    const originalPriceNum = Number(originalPrice);
    const discountedPriceNum = Number(discountedPrice);

    if (discountedPriceNum >= originalPriceNum) {
      return res.status(400).json(
        new ApiError(400, "Discounted price must be less than original price")
      );
    }

    // Parse sizes which may come as JSON string or CSV or single value
    let sizesArray = [];
    if (Array.isArray(sizes)) {
      sizesArray = sizes;
    } else if (typeof sizes === "string") {
      try {
        const parsed = JSON.parse(sizes);
        sizesArray = Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch (_) {
        sizesArray = sizes.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    // Upload images
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      }
    }

    if (images.length === 0) {
      return res.status(400).json(
        new ApiError(400, "At least one product image is required")
      );
    }

    // Create new product
    const newProduct = new Product({
      title,
      description,
      originalPrice: originalPriceNum,
      discountedPrice: discountedPriceNum,
      images,
      sizes: sizesArray,
      category,
      tag,
      vendor: vendorId,
    });

    const savedProduct = await newProduct.save();

    // Add product to vendor's products array
    vendor.products.push(savedProduct._id);
    await vendor.save();

    // Add product to category's products array
    categoryExists.products.push(savedProduct._id);
    await categoryExists.save();

    // Populate the saved product
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate("category", "title tag")
      .populate("vendor", "name username email");

    return res.status(201).json(
      new ApiResponse(201, populatedProduct, "Product added to vendor successfully by intern")
    );
  } catch (error) {
    console.error("Error adding product to vendor:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to add product to vendor")
    );
  }
});

// Get vendor's products for management
const getVendorProducts = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;

    const products = await Product.find({ vendor: vendorId })
      .populate("category", "title tag")
      .populate("vendor", "name username email");

    return res.status(200).json(
      new ApiResponse(200, products, "Vendor products fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to fetch vendor products")
    );
  }
});

// Update vendor details
const updateVendorByIntern = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { name, username, email, phone, address } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json(
        new ApiError(404, "Vendor not found")
      );
    }

    // Check for email/username conflicts
    if (email && email.toLowerCase() !== vendor.email) {
      const existingEmail = await Vendor.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json(
          new ApiError(400, "Email already exists")
        );
      }
    }

    if (username && username.toLowerCase() !== vendor.username) {
      const existingUsername = await Vendor.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return res.status(400).json(
          new ApiError(400, "Username already exists")
        );
      }
    }

    // Upload new image if provided
    let imageUrl = vendor.image;
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (uploaded?.secure_url) {
        imageUrl = uploaded.secure_url;
      }
    }

    // Update vendor
    vendor.name = name || vendor.name;
    vendor.username = username ? username.toLowerCase() : vendor.username;
    vendor.email = email ? email.toLowerCase() : vendor.email;
    vendor.phone = phone || vendor.phone;
    vendor.image = imageUrl;

    if (address) {
      vendor.address = {
        area: address.area || vendor.address.area,
        city: address.city || vendor.address.city,
        pincode: address.pincode || vendor.address.pincode,
        state: address.state || vendor.address.state,
        country: address.country || vendor.address.country,
      };
    }

    await vendor.save();

    // Update corresponding user account
    const user = await User.findOne({ email: vendor.email, role: "vendor" });
    if (user) {
      user.name = vendor.name;
      user.email = vendor.email;
      user.phone = vendor.phone;
      user.image = vendor.image;
      await user.save();
    }

    return res.status(200).json(
      new ApiResponse(200, vendor, "Vendor updated successfully by intern")
    );
  } catch (error) {
    console.error("Error updating vendor by intern:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to update vendor")
    );
  }
});

// Delete vendor (with cleanup)
const deleteVendorByIntern = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json(
        new ApiError(404, "Vendor not found")
      );
    }

    // Delete vendor (this will trigger the pre-delete middleware)
    await Vendor.findByIdAndDelete(vendorId);

    // Delete corresponding user account
    await User.findOneAndDelete({ email: vendor.email, role: "vendor" });

    return res.status(200).json(
      new ApiResponse(200, {}, "Vendor deleted successfully by intern")
    );
  } catch (error) {
    console.error("Error deleting vendor by intern:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to delete vendor")
    );
  }
});

// Get all categories for product creation
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .select("title description image tag");

    return res.status(200).json(
      new ApiResponse(200, categories, "All categories fetched successfully")
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to fetch categories")
    );
  }
});

// Delete a specific product for a vendor (intern can delete)
const deleteVendorProductByIntern = asyncHandler(async (req, res) => {
  try {
    const { vendorId, productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json(
        new ApiError(404, "Product not found")
      );
    }

    if (String(product.vendor) !== String(vendorId)) {
      return res.status(400).json(
        new ApiError(400, "Product does not belong to the specified vendor")
      );
    }

    await Product.findByIdAndDelete(productId);

    return res.status(200).json(
      new ApiResponse(200, {}, "Product deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting vendor product by intern:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to delete product")
    );
  }
});

export {
  getAllVendorsForIntern,
  createVendorByIntern,
  addProductToVendor,
  getVendorProducts,
  updateVendorByIntern,
  deleteVendorByIntern,
  getAllCategories,
  deleteVendorProductByIntern,
  // New export below keeps list explicit
};
