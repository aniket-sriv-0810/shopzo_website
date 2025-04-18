import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';

import {editVendorValidation} from '../test/vendorEdit.validator.js' ;
import { getAllVendors,vendorAccountDetails ,   updateVendorById , getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData , vendorCategoriesData , addCategoriesToVendor , productOfVendorData, allProductsOfVendor } from "../controller/vendor.controller.js";
import { reviewSchemaValidation } from '../test/review.validator.js';
import { addReviewToVendor, getVendorReviews } from '../controller/review.controller.js';
import { loginVendor, logOutAccount , checkVendorAuthentication , changePassword } from '../controller/vendorAuth.controller.js';
import { loginVendorValidation } from '../test/loginVendor.validator.js';
const router = express.Router();

//Core router - /api/vendor

// Check for the All vendors Route
router
     .route('/login')
     .post(validate(loginVendorValidation) ,loginVendor)


router
     .route('/logout')
     .post(logOutAccount)


router
     .route('/check-auth')
     .get(checkVendorAuthentication)

router
     .route('/:id/account/change-password')
     .put(changePassword)


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
     .get(isLoggedIn , vendorCategoriesData)
     
// Check for the  vendor account categories Route
router
     .route("/:id/details/categories-listed")
     .get(isLoggedIn , vendorCategoriesData)



// Check for the  vendor account products Route
router
     .route("/:id/account/products-listed")
     .get(isLoggedIn , allProductsOfVendor)

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
     .get(isLoggedIn , productOfVendorData)


// Fetch all products by vendor + category + tag Route
router
      .route("/:vendorId/products")
      .get( getVendorProductsByCategoryAndTag);

// Check for the All vendors Required Counts  Route
router
      .route("/:vendorId/account/dashboard")
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
     .put( isLoggedIn, upload.single("image"),updateVendorById);

// Change password for Vendor Account Route
router
     .route("/:id/all-reviews")
     .get(isLoggedIn , getVendorReviews)


export default router;