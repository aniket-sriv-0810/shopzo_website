import express from 'express';
import { validate } from '../middleware/validator.js';
import { authenticateUser } from '../middleware/jwt.middleware.js';
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
     .get(authenticateUser , isAdmin, adminDashboardData)

router
     .route("/users")
     .get(  authenticateUser ,isAdmin , adminUserData)

router
     .route("/vendors")
     .get(authenticateUser , isAdmin , adminVendorData)

router
     .route("/categories")
     .get(authenticateUser , isAdmin , adminCategoryData)

router
     .route("/products")
     .get(authenticateUser , isAdmin , adminProductData)

router
     .route("/bookings")
     .get(authenticateUser , isAdmin ,  adminBookingData)

router
     .route("/deliveries")
    .get(authenticateUser, isAdmin, adminDeliveryData);

router
     .route("/deliveries/:id")
    .delete(authenticateUser, isAdmin, deleteDelivery);

router
     .route("/feedbacks")
     .get(authenticateUser , isAdmin , adminFeedbackData)

// Add category route
router
     .route("/add-category")
     .post(authenticateUser , isAdmin , upload.single('image') , validate(categorySchemaValidation) , createCategory)

// Add categories to vendor route
router
     .route("/vendor/:vendorId/add-categories")
     .post(authenticateUser , isAdmin , addCategoriesToVendor)

// Edit category route
router
     .route("/category/:id/edit")
     .put(authenticateUser , isAdmin , upload.single('image') , validate(updateCategorySchemaValidation) , editCategory)

// Delete category route
router
     .route("/category/:id/delete")
     .delete(authenticateUser ,  isAdmin , deleteCategory)

// Add product route
router
     .route("/add-product")
     .post(authenticateUser , isAdmin , upload.array("images" , 7) ,
         validate(productSchemaValidation) , addProductController)

// Edit product route
router
     .route("/product/:id/edit")
     .put(authenticateUser , isAdmin , upload.array("images", 7)  , updateProductById )

// Delete product route
router
     .route("/product/:id/delete")
     .delete(authenticateUser , isAdmin , deleteProductById)

// Add vendor route
router
     .route("/add-vendor")
     .post(authenticateUser , isAdmin , upload.single("image") ,  validate(vendorSchemaValidation) , addNewVendor)

// Add category to vendor route
router
      .route("/add-category-to-vendor/:vendorId")
      .post(authenticateUser ,isAdmin, validate(addCategoryToVendorValidation) ,addCategoryToVendor);

// Delete vendor route
router
     .route("/vendor/:id/account/delete")
     .delete(authenticateUser, isAdmin , deleteVendorById);

// Delete booking route
router
     .route("/bookings/:bookingId")
     .delete(authenticateUser, isAdmin , adminDeleteBooking);

// Delete contact route
router
      .route('/contact/:contactId')
      .delete(authenticateUser , isAdmin , deleteContactById);

// Update user role route
router
     .route("/users/:userId/role")
     .put(authenticateUser, isAdmin, updateUserRoleByAdmin);
export default router;
