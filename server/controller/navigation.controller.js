import {Faq} from "../models/faq.model.js";
import {Contact} from "../models/contact.model.js";
import {User} from "../models/user.model.js";
import {Product} from "../models/product.model.js";
import {Vendor} from "../models/vendor.model.js";
import {Category} from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import mongoose from "mongoose";

const faqData = asyncHandler( async ( req , res) => {
    try {
      const faq = await Faq.find({});
  
      if(!faq){
        return res.status(404).json({
          status:404,
          message:"Service not found ",
          details :["Unable to find FAQs"]
        })
      }
  
      return res.status(200).json(
        new ApiResponse(200 , {faq} , "FAQS fetched successfully!")
      )
    }
     catch (error) {
      return res.status(400).json(
        new ApiError(400 , error , "Unable to fetch FAQs !")
      )
    }
  });

// POST /contact
const createContactMessage = async (req, res) => {
  try {
    const { user, message, status } = req.body;

    // 🛡️ Double-check user exists (extra protection)
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found!" });
    }

    // ✉️ Create new contact message
    const newContact = new Contact({
      user,
      message,
      status: status || "Pending",
    });

    await newContact.save();

    return res.status(200).json({
      success: true,
      message: "Your feedback has been sent successfully!",
      contact: newContact,
    });
  } catch (err) {
    console.error("Error submitting contact message:", err);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while submitting your message.",
    });
  }
};

const searchAll = async (req, res) => {
  try {
    const { query, page = 1, limit = 6 } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required." });
    }

    const skip = (page - 1) * limit;

    const regexQuery = { $regex: query, $options: "i" };

    // Find matching categories first (by title)
    const matchedCategories = await Category.find({ title: regexQuery });
    const categoryIds = matchedCategories.map((cat) => cat._id);

    // Search Vendors (by name)
    const vendorQuery = Vendor.find({ name: regexQuery });
    const vendors = await vendorQuery.skip(skip).limit(limit);
    const totalVendors = await Vendor.countDocuments({ name: regexQuery });

    // Search Products (title, tag, or matched category)
    const productQuery = Product.find({
      $or: [
        { title: regexQuery },
        { tag: regexQuery },
        { category: { $in: categoryIds } },
      ],
    })
      .populate("category", "title image")
      .populate("vendor", "name image");

    const products = await productQuery.skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments({
      $or: [
        { title: regexQuery },
        { tag: regexQuery },
        { category: { $in: categoryIds } },
      ],
    });

    return res.status(200).json({
      vendors,
      products,
      totalVendors,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(Math.max(totalVendors, totalProducts) / limit),
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export {faqData , createContactMessage , searchAll}