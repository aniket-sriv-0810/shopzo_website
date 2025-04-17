import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"; // assuming you use this for image upload
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

// 📌 Create Category Controller
const createCategory = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      tag,
      products,
    } = req.body;

    // 🔍 Check for duplicate title
    const existingCategory = await Category.findOne({ title: title.trim() });
    if (existingCategory) {
      return res.status(400).json(
        new ApiError(400, ["Category title already exists"], "Validation Error")
      );
    }

    // ❌ If image file not uploaded, throw error
    if (!req.file) {
      return res.status(400).json(
        new ApiError(400, ["Image is required!"], "Validation Error")
      );
    }

    // ☁️ Upload image
    const imageUrl = await uploadOnCloudinary(req.file.path);

    // ✅ Create new category
    const newCategory = new Category({
      title: title.trim(),
      description: description || "",
      tag,
      image: imageUrl.url,
      products: products || [],
    });

    const savedCategory = await newCategory.save();

    return res.status(201).json(
      new ApiResponse(201, { category: savedCategory }, "Category added successfully!")
    );
  } catch (error) {
    console.error("❌ Error while creating category:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to create category")
    );
  }
});

// Controller: Get All Categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("products") // Remove this if you don't need product data here
      .sort({ createdAt: -1 });

    if (categories.length === 0) {
      return res
        .status(404)
        .json(new ApiError(404, "No categories found."));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, { categories }, "Categories fetched successfully!"));
  } catch (error) {
    console.error("❌ Error while fetching categories:", error);
    return res
      .status(500)
      .json(new ApiError(500, error.message, "Failed to fetch categories"));
  }
});

  const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    // Check if the ID is a valid Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid category ID format.");
    }
  
    const category = await Category.findById(id).populate("products");
  
    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, { category }, "Category fetched successfully."));
  });
  

// Show all products belong to that category and that tag
const getProductsByCategoryAndTag = asyncHandler(async (req, res) => {
  const { id, tag } = req.params;

  // Validate tag
  if (!["male", "female"].includes(tag)) {
    return res.status(400).json(new ApiError(400, "Invalid tag value."));
  }

  try {
    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json(new ApiError(404, "Category not found"));
    }

    // Find products matching the category and tag
    const products = await Product.find({
      category: id,
      tag: tag,
    }).populate("category", "title tag");

    if (!products || products.length === 0) {
      return res.status(404).json(new ApiError(404, "No products found"));
    }

    return res.status(200).json(
      new ApiResponse(200, { category, products }, "Products fetched successfully")
    );
  } catch (error) {
    console.error("❌ Error fetching products by category and tag:", error);
    return res.status(500).json(
      new ApiError(500, error.message, "Failed to fetch products")
    );
  }
});


  const editCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, image } = req.body;
  
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  
    // If title is being updated, check if it's already used by another category
    if (title && title !== category.title) {
      const existingTitle = await Category.findOne({ title: title.trim() });
      if (existingTitle) {
        throw new ApiError(409, "Title already exists. Please use a different one.");
      }
      category.title = title.trim();
    }
  
    if (description !== undefined) {
      category.description = description.trim();
    }
  
    if (image !== undefined) {
      category.image = image;
    }
  
    await category.save();
  
    return res
      .status(200)
      .json(new ApiResponse(200, { category }, "Category updated successfully"));
  });

  const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const category = await Category.findById(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }
  
    // Optional: Clean-up product/category relations here if needed
    // e.g. remove category reference from related products
  
    await Category.findByIdAndDelete(id);
  
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Category deleted successfully"));
  });
export { createCategory , getAllCategories , getCategoryById, getProductsByCategoryAndTag , editCategory , deleteCategory };
