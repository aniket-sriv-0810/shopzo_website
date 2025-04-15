import express from 'express';
import { validate } from '../middleware/validator.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import { isAdmin } from '../middleware/admin.middleware.js';
import { adminBookingData, adminCategoryData, adminDashboardData, adminFeedbackData, adminProductData, adminUserData, adminVendorData , addCategoryToVendor} from '../controller/admin.controller.js';
import { createCategory ,  editCategory, deleteCategory } from '../controller/category.controller.js';
import {addProductController  , updateProductById , deleteProductById} from "../controller/product.controller.js";
import {   addNewVendor  , deleteVendorById} from "../controller/vendor.controller.js";
import { categorySchemaValidation } from "../test/category.validator.js";
import { updateCategorySchemaValidation } from "../test/categoryEdit.validator.js";
import {productSchemaValidation} from "../test/product.validator.js";
import { editProductSchemaValidation } from '../test/productEdit.validator.js';
import {vendorSchemaValidation} from '../test/vendor.validator.js' ;
const router = express.Router();

// Core router - /api/admin

router
     .route("/dashboard")
     .get(isLoggedIn , isAdmin, adminDashboardData)

router
     .route("/users")
     .get(isLoggedIn , isAdmin ,adminUserData)

router
     .route("/vendors")
     .get(isLoggedIn , isAdmin , adminVendorData)

router
     .route("/categories")
     .get(isLoggedIn , isAdmin , adminCategoryData)

router
     .route("/products")
     .get(isLoggedIn , isAdmin , adminProductData)

router
     .route("/bookings")
     .get(isLoggedIn , isAdmin ,  adminBookingData)

router
     .route("/feedbacks")
     .get(isLoggedIn , isAdmin , adminFeedbackData)

// Check for Adding categories Route
router
     .route("/add-category")
     .post(isLoggedIn , isAdmin , upload.single('image') , validate(categorySchemaValidation) , createCategory)

// Check for Editing categories Route
router
     .route("category/:id/edit")
     .put(isLoggedIn , isAdmin , upload.single('image') , validate(updateCategorySchemaValidation) , editCategory)

// Check for the Deleting categories Route
router
     .route("category/:id/delete")
     .delete(isLoggedIn ,  isAdmin , deleteCategory)

//check for Adding  product Route
router
     .route("/add-product")
     .post(isLoggedIn , isAdmin , upload.array("images" , 7) ,
         validate(productSchemaValidation) , addProductController)

//check for the particular product Edit Route
router
     .route("product/:id/edit")
     .put(isLoggedIn , isAdmin , upload.array("images", 7) , validate(editProductSchemaValidation) , updateProductById )

//check for the particular product Delete Route
router
     .route("product/:id/delete")
     .delete(isLoggedIn , isAdmin , deleteProductById)

// Adding Vendor Route
router
     .route("/add-vendor")
     .post(isLoggedIn , upload.single("image") ,  validate(vendorSchemaValidation) , addNewVendor)

// Admin adds a category to a specific vendor
router
      .route("/add-category-to-vendor/:vendorId")
      .post( isAdmin, addCategoryToVendor);

// Deleting a  vendor Account Route
router
     .route("vendor/:id/account/delete")
     .delete(isLoggedIn, deleteVendorById);


export default router;
