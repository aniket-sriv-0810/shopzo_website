import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';

import {editVendorValidation} from '../test/vendorEdit.validator.js' ;
import { getAllVendors,vendorAccountDetails ,   updateVendorById , getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData} from "../controller/vendor.controller.js";
import { reviewSchemaValidation } from '../test/review.validator.js';
import { addReviewToVendor, getVendorReviews } from '../controller/review.controller.js';

const router = express.Router();

//Core router - /api/vendor

// Check for the All vendors Route
router
     .route('/login')
     .get(getAllVendors)

router
     .route('/all-vendors')
     .get(getAllVendors)

// Check for the  vendor account Route
router
     .route("/:id/account")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account bookings Route
router
     .route("/:id/account/bookings")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account bookings Route
router
     .route("/:id/account/booking/:bookingId/update-payment-status")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account categories Route
router
     .route("/:id/account/categories-listed")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account products Route
router
     .route("/:id/account/products-listed")
     .get(isLoggedIn , vendorAccountDetails)

// Check for the  vendor account Route
router
     .route("/:id/account")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account all categories Route
router
     .route("/:id/account/all-categories")
     .get(isLoggedIn , vendorAccountDetails)


// Check for the  vendor account all particular products having the particular vendor/category/tag Route
router
     .route("/:id/account/:categoryId/:tag/all-products")
     .get(isLoggedIn , vendorAccountDetails)


// Fetch all products by vendor + category + tag Route
router
      .route("/:vendorId/products")
      .get( getVendorProductsByCategoryAndTag);

// Check for the All vendors Required Counts  Route
router
      .route("/:vendorId/dashboard-counts")
      .get( getVendorCounts);


//  Check for the  vendor  Full dashboard data Route
router
      .route("/:vendorId/dashboard-data")
      .get(getVendorDashboardData);


//  Check for the posting review on  vendor  Route
router
     .route("/:id/review")
     .post(isLoggedIn , validate(reviewSchemaValidation), addReviewToVendor)

//  Check for the  vendor all reviews data Route
router
     .route("/:id/all-reviews")
     .get(isLoggedIn , getVendorReviews)

//  Check for the  vendor all reviews data Route
router
     .route("/:id/review-stats")
     .get(isLoggedIn , getVendorReviews)

//  Check for the  vendor  Edit Account Route
router
     .route("/:id/account/edit")
     .put( isLoggedIn, upload.single("image"), validate(editVendorValidation),updateVendorById);

// Change password for Vendor Account Route
router
     .route("/:id/all-reviews")
     .get(isLoggedIn , getVendorReviews)


export default router;