import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {isVendor} from "../middleware/vendor.middleware.js"
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';
import { getAllVendors,vendorAccountDetails ,   updateVendorById , getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData , vendorCategoriesData  , productOfVendorData, allProductsOfVendor, getVendorAllBookings, updateBookingStatusByVendor, vendorDeleteBooking, updateProductPrices } from "../controller/vendor.controller.js";
import { loginVendorValidation } from '../test/Vendor/vendorLogin.validator.js';
import { changePasswordValidation } from '../test/Vendor/vendorChangePassword.validator.js';
import { updateBookingStatusValidation } from '../test/Vendor/vendorBookingStatusBar.js';
import { reviewSchemaValidation } from '../test/User/userReview.validator.js';
import { editVendorValidation } from '../test/Vendor/vendorEdit.validator.js';
import { updateProductPricesValidation } from '../test/Vendor/vendorPriceUpdate.validator.js';
import { addReviewToVendor, getVendorReviews, getVendorReviewStats } from '../controller/review.controller.js';
import { loginVendor, logOutAccount , checkVendorAuthentication , changePassword } from '../controller/vendorAuth.controller.js';

const router = express.Router();

//Core router - /api/vendor

// provide  the login feature for registered vendors Route
router
     .route('/login')
     .post(  validate(loginVendorValidation) ,loginVendor)

// provide the logout feature for the registered vendor Route
router
     .route('/logout')
     .post( isVendor , logOutAccount)

// checking for the authentication of the vendor route
router
     .route('/check-auth')
     .get(checkVendorAuthentication)

//changing the password feature for vendor Route
router
     .route('/:id/account/change-password')
     .put( isVendor , validate(changePasswordValidation) , changePassword)

// provides all vendor details Route
router
     .route('/all-vendors')
     .get(getAllVendors)

// provides the  vendor account details Route
router
     .route("/:id/account")
     .get(isLoggedIn , isVendor , vendorAccountDetails)


// provides the  vendor account bookings details Route
router
     .route("/:id/account/bookings")
     .get(isLoggedIn , isVendor , vendorAccountDetails)


// provides the  vendor account categories details Route
router
     .route("/:id/account/categories-listed")
     .get(isLoggedIn , isVendor , vendorCategoriesData)


//  provides the  vendor account products details Route
router
     .route("/:id/account/products-listed")
     .get(isLoggedIn , isVendor , allProductsOfVendor)

// provides the  vendor account all bookings details Route
router
     .route("/:id/account/all-bookings")
     .get(isLoggedIn , isVendor , getVendorAllBookings )


//provides the  vendor updating booking status  details Route
router
     .route("/:vendorId/bookings/:bookingId/status")
     .put(isLoggedIn, isVendor ,  validate(updateBookingStatusValidation) ,updateBookingStatusByVendor);

// CLIENT SIDE - provides the  vendor categories details Route
router
     .route("/:id/details/categories-listed")
     .get( vendorCategoriesData)


// CLIENT SIDE - provides the  vendor show page details Route
router
     .route("/:id")
     .get(vendorAccountDetails)


// CLIENT SIDE - provides the  vendor all categories details Route
router
     .route("/:id/all-categories")
     .get( vendorAccountDetails)


// Check for the  vendor account all particular products having the particular vendor/category/tag Route
router
     .route("/:id/account/:categoryId/:tag/all-products")
     .get(isLoggedIn , isVendor , productOfVendorData)


//CLIENT-side -  Fetch all products by vendor + category + tag Route
router
      .route("/:vendorId/products")
      .get( getVendorProductsByCategoryAndTag);

// provides vendors dashboard Counts  Route
router
      .route("/:vendorId/account/dashboard")
      .get( isLoggedIn , isVendor ,getVendorCounts);


//  provides vendors full dashboard data  Route
router
      .route("/:vendorId/account /dashboard-data")
      .get( isLoggedIn , isVendor , getVendorDashboardData);


//  Check for the posting review on  vendor  Route
router
     .route("/:id/review")
     .post(isLoggedIn , validate(reviewSchemaValidation) , addReviewToVendor)

//  Check for the  vendor all reviews data Route
router
     .route("/:id/all-reviews")
     .get(  getVendorReviews)

//  Check for the  vendor all reviews data Route
router
     .route("/:id/review-stats")
     .get(  getVendorReviewStats)

//  Check for the  vendor  Edit Account Route
router
     .route("/:id/account/edit")
     .put( isLoggedIn, upload.single("image"), validate(editVendorValidation) ,updateVendorById);


// DELETE booking by vendor Route
router
      .route("/:id/account/bookings/:bookingId/:userId/:productId")
      .delete(isLoggedIn, isVendor ,vendorDeleteBooking);


// PUT  route to update product prices Route
router
      .route("/:id/account/product/:vendorId/:productId/update-prices")
      .put( isLoggedIn , isVendor , validate(updateProductPricesValidation) ,updateProductPrices);


export default router;