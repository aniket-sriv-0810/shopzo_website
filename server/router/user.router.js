import express from 'express' ;
import { authenticateUser, optionalAuth } from '../middleware/jwt.middleware.js';
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';
import {userSchemaValidation} from '../test/User/user.validator.js' ;
import {userEditValidationSchema} from '../test/User/userEdit.validator.js' ;
import { loginUserValidation } from '../test/User/userLogin.validator.js';
import { toggleProductWishlistSchema } from '../test/User/userProductWishlists.validator..js';
import { toggleVendorWishlistSchema } from '../test/User/userVendorWishlists.validator.js';
import { changeUserPasswordSchema } from '../test/User/userPasswordChange.validator.js';
import { createNewUser , loginUser , logOutUser , checkAuthentication, changeUserPassword, forgotPassword, resetPassword } from '../controller/userAuth.controller.js';
import {userAccountDetails , getUserWishlists , toggleProductWishlist , editUserDetails , deleteUserAccount, getUserBookings , cancelUserBooking ,getUserVendorWishlists ,  toggleVendorWishlist, userDeleteCancelledBooking, getUserDeliveries, cancelUserDelivery, userDeleteCancelledDelivery} from "../controller/user.controller.js";
const router = express.Router();


// core router : /api/user

// Register a New user Route
router
     .route('/register')
     .post(validate(userSchemaValidation) , createNewUser);


// Login of the registered user Route
router
     .route('/login')
     .post(validate(loginUserValidation) , loginUser);

// Test endpoint to verify routing
router
     .route('/test-login')
     .post((req, res) => {
       console.log("🧪 Test login endpoint hit:", req.body);
       res.json({ message: "Test endpoint working", body: req.body });
     });


// Logout of the registered user Route
router
     .route('/logout')
     .post(logOutUser);


// Check for the user authentication Route
router
     .route('/auth')
     .get(optionalAuth, checkAuthentication)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// provide the user Account details Route
router
     .route('/:id/account')
     .get(authenticateUser , userAccountDetails);


// provide the user product Wishlists details Route
router
     .route('/:id/account/wishlists')
     .get(authenticateUser , getUserWishlists);


// provide  the toggling user products Wishlists Route
router
     .route('/:id/account/wishlist')
     .post(authenticateUser ,validate(toggleProductWishlistSchema) ,  toggleProductWishlist);


// provide the user vendor Wishlists details Route
router
  .route("/:id/account/vendor-wishlists")
  .get(authenticateUser, getUserVendorWishlists);


// provide  the toggling user vendor Wishlists Route
router
  .route("/:id/account/vendor-wishlist")
  .post(authenticateUser, validate(toggleVendorWishlistSchema) , toggleVendorWishlist);


// provide the user Bookings details Route
router
     .route('/:id/account/bookings')
     .get(authenticateUser  ,getUserBookings);


// Cancel the user bookings Route
router
      .route('/:userId/account/bookings/:bookingId/cancel')
      .delete( authenticateUser, cancelUserBooking);


// Change the user Account Details Route
router
     .route('/:id/account/edit')
     .put(authenticateUser , upload.single("image"), validate(userEditValidationSchema) , editUserDetails);


// Change the user password Details Route
router
     .route('/:id/account/change-password')
     .put(authenticateUser , validate(changeUserPasswordSchema)  , changeUserPassword);


// Delete the user Account Route
router
     .route('/:id/account/delete')
     .delete(authenticateUser , deleteUserAccount);

// delete  the user's cancelled bookings Route
router
     .route('/:id/account/bookings/:bookingId')
     .delete(authenticateUser , userDeleteCancelledBooking);
// User Deliveries Routes
router
  .route("/:id/account/deliveries")
  .get(authenticateUser, getUserDeliveries);

router
  .route("/:userId/account/deliveries/:deliveryId/cancel")
  .delete(authenticateUser, cancelUserDelivery);

router
  .route("/:id/account/deliveries/:deliveryId")
  .delete(authenticateUser, userDeleteCancelledDelivery);


export default router;