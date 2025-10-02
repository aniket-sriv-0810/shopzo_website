import express from 'express' ;
import { authenticateVendor, optionalAuth } from '../middleware/jwt.middleware.js';
import {isVendor} from "../middleware/vendor.middleware.js"
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';
import {validateVendor} from '../middleware/vendorValidate.js'
import { getAllVendors,vendorAccountDetails ,   updateVendorById , getVendorProductsByCategoryAndTag , getVendorCounts , getVendorDashboardData , vendorCategoriesData  , productOfVendorData, allProductsOfVendor, getVendorAllBookings, updateBookingStatusByVendor, vendorDeleteBooking, updateProductPrices, getVendorAllDeliveries, updateDeliveryStatusByVendor, vendorDeleteDelivery } from "../controller/vendor.controller.js";
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
     .post(  logOutAccount)

// checking for the authentication of the vendor route
router
     .route('/check-auth')
     .get(optionalAuth, checkVendorAuthentication)

//changing the password feature for vendor Route
router
     .route('/:id/account/change-password')
     .put(  authenticateVendor , validate(changePasswordValidation) , changePassword)

// provides all vendor details Route
router
     .route('/all-vendors')
     .get(getAllVendors)

// provides the  vendor account details Route
router
     .route("/:id/account")
     .get(authenticateVendor  , vendorAccountDetails)

// provides the  vendor account details Route
router
     .route("/:id/account/bookings")
     .get(authenticateVendor  , vendorAccountDetails)


// provides the  vendor categories data Route
router
     .route("/:id/account/categories-listed")
     .get(authenticateVendor  , vendorCategoriesData)


// provides the  vendor products data Route
router
     .route("/:id/account/products-listed")
     .get(authenticateVendor  , allProductsOfVendor)

// provides the  vendor all bookings data Route
router
     .route("/:id/account/all-bookings")
     .get(authenticateVendor  , getVendorAllBookings )


// provides the  vendor booking status update Route
router
     .route("/:vendorId/bookings/:bookingId/status")
     .put(authenticateVendor ,  validate(updateBookingStatusValidation) ,updateBookingStatusByVendor);

// provides the  vendor categories data Route
router
     .route("/:id/details/categories-listed")
     .get( vendorCategoriesData)


// provides the  vendor account details Route
router
     .route("/:id")
     .get(vendorAccountDetails)


// provides the  vendor products data Route
router
     .route("/:id/account/:categoryId/:tag/all-products")
     .get(authenticateVendor  , productOfVendorData)


// provides the  vendor products data Route
router
      .route("/:vendorId/products")
      .get( getVendorProductsByCategoryAndTag);

// provides the  vendor counts data Route
router
      .route("/:vendorId/account/dashboard")
      .get( authenticateVendor  ,getVendorCounts);


// provides the  vendor dashboard data Route
router
      .route("/:vendorId/account /dashboard-data")
      .get( authenticateVendor  , getVendorDashboardData);


// provides the  vendor review add Route
router
     .route("/:id/review")
     .post(authenticateVendor , validate(reviewSchemaValidation) , addReviewToVendor)

// provides the  vendor all reviews Route
router
     .route("/:id/all-reviews")
     .get(  getVendorReviews)

// provides the  vendor review stats Route
router
     .route("/:id/review-stats")
     .get(  getVendorReviewStats)

// Middleware to parse FormData nested objects
const parseFormData = (req, res, next) => {
  if (req.body) {
    // Parse address fields from FormData format
    const address = {};
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('address[') && key.endsWith(']')) {
        const addressKey = key.slice(8, -1); // Remove 'address[' and ']'
        address[addressKey] = req.body[key];
        delete req.body[key];
      }
    });
    
    if (Object.keys(address).length > 0) {
      req.body.address = address;
    }
  }
  next();
};

// provides the  vendor edit Route
router
     .route("/:id/account/edit")
     .put( authenticateVendor,upload.single("image"), parseFormData, validate(editVendorValidation) ,updateVendorById);


// provides the  vendor booking delete Route
router
      .route("/:id/account/bookings/:bookingId/:userId/:productId")
      .delete(authenticateVendor ,vendorDeleteBooking);


// provides the  vendor product price update Route
router
      .route("/:id/account/product/:vendorId/:productId/update-prices")
      .put( authenticateVendor  , validate(updateProductPricesValidation) ,updateProductPrices);

// provides the  vendor all deliveries Route
router
  .route("/:id/account/all-deliveries")
  .get(authenticateVendor, getVendorAllDeliveries);

// provides the  vendor delivery status update Route
router
  .route("/:vendorId/deliveries/:deliveryId/status")
  .put(authenticateVendor, updateDeliveryStatusByVendor);

// provides the  vendor delivery delete Route
router
  .route("/:id/account/deliveries/:deliveryId/:userId/:productId")
  .delete(authenticateVendor, vendorDeleteDelivery);
export default router;