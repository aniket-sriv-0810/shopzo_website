import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';
import {userSchemaValidation} from '../test/User/user.validator.js' ;
import {userEditValidationSchema} from '../test/User/userEdit.validator.js' ;
import { loginUserValidation } from '../test/User/userLogin.validator.js';
import { toggleProductWishlistSchema } from '../test/User/userProductWishlists.validator..js';
import { toggleVendorWishlistSchema } from '../test/User/userVendorWishlists.validator.js';
import { changeUserPasswordSchema } from '../test/User/userPasswordChange.validator.js';
import { createNewUser , loginUser , logOutUser , checkAuthentication, changeUserPassword } from '../controller/userAuth.controller.js';
import {userAccountDetails , getUserWishlists , toggleProductWishlist , editUserDetails , deleteUserAccount, getUserBookings , cancelUserBooking ,getUserVendorWishlists ,  toggleVendorWishlist, userDeleteCancelledBooking} from "../controller/user.controller.js";
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


// Logout of the registered user Route
router
     .route('/logout')
     .post(logOutUser);


// Check for the user authentication Route
router
     .route('/auth')
     .get(checkAuthentication)


// provide the user Account details Route
router
     .route('/:id/account')
     .get(isLoggedIn , userAccountDetails);


// provide the user product Wishlists details Route
router
     .route('/:id/account/wishlists')
     .get(isLoggedIn , getUserWishlists);


// provide  the toggling user products Wishlists Route
router
     .route('/:id/account/wishlist')
     .post(isLoggedIn ,validate(toggleProductWishlistSchema) ,  toggleProductWishlist);


// provide the user vendor Wishlists details Route
router
  .route("/:id/account/vendor-wishlists")
  .get(isLoggedIn, getUserVendorWishlists);


// provide  the toggling user vendor Wishlists Route
router
  .route("/:id/account/vendor-wishlist")
  .post(isLoggedIn, validate(toggleVendorWishlistSchema) , toggleVendorWishlist);


// provide the user Bookings details Route
router
     .route('/:id/account/bookings')
     .get(isLoggedIn  ,getUserBookings);


// Cancel the user bookings Route
router
      .route('/:userId/account/bookings/:bookingId/cancel')
      .delete( isLoggedIn, cancelUserBooking);


// Change the user Account Details Route
router
     .route('/:id/account/edit')
     .put(isLoggedIn , upload.single("image"), validate(userEditValidationSchema) , editUserDetails);


// Change the user password Details Route
router
     .route('/:id/account/change-password')
     .put(isLoggedIn , validate(changeUserPasswordSchema)  , changeUserPassword);


// Delete the user Account Route
router
     .route('/:id/account/delete')
     .delete(isLoggedIn , deleteUserAccount);

// delete  the user's cancelled bookings Route
router
     .route(':id/account/bookings/:bookingId')
     .delete(isLoggedIn , userDeleteCancelledBooking);


export default router;