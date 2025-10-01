import express from 'express';
import { authenticateUser } from '../middleware/jwt.middleware.js';
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
  .post(authenticateUser, isIntern, upload.single('image'), createVendorByIntern);

// Get all categories
router
  .route('/categories')
  .get(getAllCategories);

// Get vendor products
router
  .route('/vendors/:vendorId/products')
  .get(getVendorProducts);

// Add product to vendor
router
  .route('/vendors/:vendorId/products')
  .post(authenticateUser, isIntern, upload.array('images', 7), addProductToVendor);

// Delete vendor product
router
  .route('/vendors/:vendorId/products/:productId')
  .delete(authenticateUser, isIntern, deleteVendorProductByIntern);

// Update vendor
router
  .route('/vendors/:vendorId')
  .put(authenticateUser, isIntern, upload.single('image'), updateVendorByIntern);

// Delete vendor
router
  .route('/vendors/:vendorId')
  .delete(authenticateUser, isIntern, deleteVendorByIntern);

export default router;
