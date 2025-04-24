import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // Adjust the path as needed
import mongoose from "mongoose";
const addProductController = async (req, res) => {
  try {
    let {
      title,
      description,
      originalPrice,
      discountedPrice,
      sizes,
      category,
      tag,
      vendor,
    } = req.body;

    // Parse and validate pricing
    originalPrice = Number(originalPrice);
    discountedPrice = Number(discountedPrice);

    // Parse sizes properly
    if (typeof sizes === "string") {
      sizes = [sizes];
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required.",
      });
    }

    // Upload images to Cloudinary
    const images = [];
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path);
      if (uploaded?.secure_url) {
        images.push(uploaded.secure_url);
      }
    }

    if (images.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed. Please try again.",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Selected category not found.",
      });
    }

    const newProduct = new Product({
      title,
      description,
      originalPrice,
      discountedPrice,
      images,
      sizes,
      category,
      tag,
      vendor,
    });

    const savedProduct = await newProduct.save();

    // Push product ID to category
    existingCategory.products.push(savedProduct._id);
    await existingCategory.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: savedProduct,
    });
  } catch (err) {
    console.error("❌ Error in addProductController:", err);
    res.status(500).json({
      success: false,
      message: "Server error. Could not add product.",
    });
  }
};



// GET /api/products/:productId
// GET /api/products/:productId
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiError(400, "Invalid product ID format"));
  }

  try {
    const product = await Product.findById(id)
      .populate("category")
      .populate({
        path: "vendor",
        select: "-__v -password -reviews", // Exclude sensitive/irrelevant fields
      });

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        { product },
        "Product fetched successfully"
      )
    );
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return res
      .status(500)
      .json(new ApiError(500, error.message || "Internal Server Error"));
  }
});


const updateProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    price,
    sizes,
    tag,
    imagesToKeep = "[]", // this should come as a JSON stringified array
  } = req.body;

  try {
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Parse retained images from frontend
    let retainedImages = JSON.parse(imagesToKeep); // array of URLs
    if (!Array.isArray(retainedImages)) retainedImages = [];

    let newUploadedImages = [];

    // Upload new images if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.secure_url) {
          newUploadedImages.push(uploaded.secure_url);
        }
      }
    }

    const combinedImages = [...retainedImages, ...newUploadedImages];

    if (combinedImages.length > 7) {
      return res
        .status(400)
        .json(new ApiError(400, "You can only have up to 7 images."));
    }

    // Update product fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.sizes = sizes || product.sizes;
    product.tag = tag || product.tag;
    product.images = combinedImages;

    await product.save();

    return res
      .status(200)
      .json(new ApiResponse(200, product, "Product updated successfully"));
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Failed to update product"));
  }
});


const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiError(400, "Invalid product ID"));
  }

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  // ✅ Trigger pre-delete middleware
  await Product.findOneAndDelete({ _id: id });

  console.log("✅ Product and related data deleted");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});




export { addProductController , getProductById , updateProductById , deleteProductById};
