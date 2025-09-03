import express from 'express';
import { validate } from '../middleware/validator.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import { isAdmin } from '../middleware/admin.middleware.js';
import { addCategoryToVendorValidation } from '../test/Vendor/vendorAddCategory.validator.js';
import { adminBookingData, adminCategoryData, adminDashboardData, adminFeedbackData, adminProductData, adminUserData, adminVendorData , addCategoryToVendor, adminDeleteBooking, deleteContactById, adminDeliveryData, deleteDelivery, updateUserRoleByAdmin} from '../controller/admin.controller.js';
import { createCategory ,  editCategory, deleteCategory } from '../controller/category.controller.js';
import {addProductController  , updateProductById , deleteProductById} from "../controller/product.controller.js";
import { addCategoriesToVendor, deleteVendorById} from "../controller/vendor.controller.js";
import { addNewVendor } from '../controller/vendorAuth.controller.js';
import { categorySchemaValidation } from '../test/Category/category.validator.js';
import { productSchemaValidation } from '../test/Product/product.validator.js';
import { editProductSchemaValidation } from '../test/Product/productEdit.validator.js';
import { vendorSchemaValidation } from '../test/Vendor/vendor.validator.js';
import { updateCategorySchemaValidation } from '../test/Category/categoryEdit.validator.js';
const router = express.Router();

// Core router - /api/admin

router
     .route("/dashboard")
     .get(isLoggedIn , isAdmin, adminDashboardData)

router
     .route("/users")
     .get(  isLoggedIn ,isAdmin , adminUserData)

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
     .route("/deliveries")
    .get(isLoggedIn, isAdmin, adminDeliveryData);

router
     .route("/deliveries/:id")
    .delete(isLoggedIn, isAdmin, deleteDelivery);

router
     .route("/feedbacks")
     .get(isLoggedIn , isAdmin , adminFeedbackData)

//  Adding categories Route
router
     .route("/add-category")
     .post(isLoggedIn , isAdmin , upload.single('image') , validate(categorySchemaValidation) , createCategory)

//  Adding  categories to vendors Route
router
     .route("/vendor/:vendorId/add-categories")
     .post(isLoggedIn , isAdmin , addCategoriesToVendor)

// Editing categories Route
router
     .route("/category/:id/edit")
     .put(isLoggedIn , isAdmin , upload.single('image') , validate(updateCategorySchemaValidation) , editCategory)

//  the Deleting categories Route
router
     .route("/category/:id/delete")
     .delete(isLoggedIn ,  isAdmin , deleteCategory)

// Adding  product Route
router
     .route("/add-product")
     .post(isLoggedIn , isAdmin , upload.array("images" , 7) ,
         validate(productSchemaValidation) , addProductController)

// particular product Edit Route
router
     .route("/product/:id/edit")
     .put(isLoggedIn , isAdmin , upload.array("images", 7)  , updateProductById )

//check for the particular product Delete Route
router
     .route("/product/:id/delete")
     .delete(isLoggedIn , isAdmin , deleteProductById)

// Adding Vendor Route
router
     .route("/add-vendor")
     .post(isLoggedIn , isAdmin , upload.single("image") ,  validate(vendorSchemaValidation) , addNewVendor)

// Admin adds a category to a specific vendor
router
      .route("/add-category-to-vendor/:vendorId")
      .post(isLoggedIn ,isAdmin, validate(addCategoryToVendorValidation) ,addCategoryToVendor);

// Deleting a  vendor Account Route
router
     .route("/vendor/:id/account/delete")
     .delete(isLoggedIn, isAdmin , deleteVendorById);

// Deleting a  booking details Route
router
     .route("/bookings/:bookingId")
     .delete(isLoggedIn, isAdmin , adminDeleteBooking);

// DELETE /api/admin/contact/:contactId
router
      .route('/contact/:contactId')
      .delete(isLoggedIn , isAdmin , deleteContactById);

// Route for admin to update user roles
router
     .route("/users/:userId/role")
     .put(isLoggedIn, isAdmin, updateUserRoleByAdmin);
export default router;
