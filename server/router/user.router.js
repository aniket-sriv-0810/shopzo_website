import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {upload} from "../multer.js";
import {validate} from '../middleware/validator.js';
import {userSchemaValidation} from '../test/user.validator.js' ;
import {userEditValidationSchema} from '../test/userEdit.validator.js' ;
import { loginUserValidation } from '../test/login.validator.js';
import { createNewUser , loginUser , logOutUser , checkAuthentication } from '../controller/userAuth.controller.js';
import {userAccountDetails , getUserWishlists , toggleProductWishlist , editUserDetails , deleteUserAccount, getUserBookings , cancelUserBooking} from "../controller/user.controller.js";
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

// Check for the user Account Route
router
     .route('/:id/account')
     .get(isLoggedIn , userAccountDetails);

// Check for the user Wishlists Route
router
     .route('/:id/account/wishlists')
     .get(isLoggedIn , getUserWishlists);


// Check for the user vendors Wishlists Route
router
     .route('/:id/account/vendor-wishlists')
     .get(isLoggedIn , getUserWishlists);

// ADD/REMOVE the user Vendor wishlists Route
router
     .route('/:id/account/vendor-wishlist')
     .post( isLoggedIn,toggleProductWishlist)

// Check for the user Bookings Route
router
     .route('/:id/account/bookings')
     .get(isLoggedIn , getUserBookings);

// Cancel the user bookings Route
router
      .route('/:userId/:productId')
      .delete( isLoggedIn, cancelUserBooking);

// Change the user Account Details Route
router
     .route('/:id/account/edit')
     .put(isLoggedIn , upload.single("image"), validate(userEditValidationSchema) , editUserDetails);

// Change the user password Route
router
     .route('/:id/account/change-password')
     .put(isLoggedIn , validate(userEditValidationSchema) , editUserDetails);

// Delete the user Account Route
router
     .route('/:id/account/delete')
     .delete(isLoggedIn , deleteUserAccount);


export default router;