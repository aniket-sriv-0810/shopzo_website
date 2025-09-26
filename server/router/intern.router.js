import express from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { isIntern } from '../middleware/intern.middleware.js';
import { upload } from '../multer.js';
import { validate } from '../middleware/validator.js';
import {
  getAllVendorsForIntern,
  createVendorByIntern,
  addProductToVendor,
  getVendorProducts,
  updateVendorByIntern,
  deleteVendorByIntern,
  getAllCategories,
  deleteVendorProductByIntern,
} from '../controller/intern.controller.js';

const router = express.Router();

// Core router - /api/intern

// Get all vendors for intern management (read-only, no auth required)
router
  .route('/vendors')
  .get(getAllVendorsForIntern);

// Create new vendor
router
  .route('/vendors')
  .post(isLoggedIn, isIntern, upload.single('image'), createVendorByIntern);

// Get all categories (read-only, no auth required)
router
  .route('/categories')
  .get(getAllCategories);

// Get vendor's products (read-only, no auth required)
router
  .route('/vendors/:vendorId/products')
  .get(getVendorProducts);

// Add product to vendor
router
  .route('/vendors/:vendorId/products')
  .post(isLoggedIn, isIntern, upload.array('images', 7), addProductToVendor);

// Delete a vendor's specific product
router
  .route('/vendors/:vendorId/products/:productId')
  .delete(isLoggedIn, isIntern, deleteVendorProductByIntern);

// Update vendor details
router
  .route('/vendors/:vendorId')
  .put(isLoggedIn, isIntern, upload.single('image'), updateVendorByIntern);

// Delete vendor
router
  .route('/vendors/:vendorId')
  .delete(isLoggedIn, isIntern, deleteVendorByIntern);

export default router;
