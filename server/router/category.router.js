import express from 'express' ;

import {  getAllCategories , getCategoryById, getProductsByCategoryAndTag } from '../controller/category.controller.js';
const router = express.Router();

// Core router - /api/category

// Check for the All categories Route
router
     .route("/")
     .get( getAllCategories)

// Check for the Particular category Route
router
     .route("/:id")
     .get( getCategoryById )

// Check for the All products with tag in category Route
router
     .route("/:id/:tag/products")
     .get(getProductsByCategoryAndTag)




export default router ;