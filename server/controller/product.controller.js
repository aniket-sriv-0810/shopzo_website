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

  // ✅ Validate MongoDB ObjectId early
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiError(400, "Invalid product ID format"));
  }

  try {
    const product = await Product.findById(id)
      .populate("category", "title tag")
      .populate("vendor", "name image"); // ✅ Optionally add vendor fields if needed

    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // ✅ Explicitly convert fields to avoid accidental undefined/null leaks
    const {
      _id,
      title,
      description,
      originalPrice,
      discountedPrice,
      images,
      sizes,
      tag,
      category,
      vendor,
    } = product;

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          _id,
          title,
          description,
          originalPrice: Number(originalPrice),
          discountedPrice: Number(discountedPrice),
          images: images || [],
          sizes: sizes || [],
          tag,
          category,
          vendor,
        },
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
  const { title, description, price, sizes, tag } = req.body;

  try {
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Handle image uploads if new images are provided
    let images = product.images;
    if (req.files && req.files.length > 0) {
      images = [];
      for (const file of req.files) {
        const uploaded = await uploadOnCloudinary(file.path);
        if (uploaded?.secure_url) {
          images.push(uploaded.secure_url);
        }
      }
    }

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.sizes = sizes || product.sizes;
    product.tag = tag || product.tag;
    product.images = images;

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

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json(new ApiError(404, "Product not found"));
    }

    // Remove product from category's product list
    await Category.updateOne(
      { _id: product.category },
      { $pull: { products: product._id } }
    );

    await Product.findByIdAndDelete(id);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Failed to delete product"));
  }
});



export { addProductController , getProductById , updateProductById , deleteProductById};
