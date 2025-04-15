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

router
     .route('/:id/account')
     .get(isLoggedIn , userAccountDetails);

router
     .route('/:id/account/wishlists')
     .get(isLoggedIn , getUserWishlists);

router
     .route('/:id/account/wishlist')
     .post( isLoggedIn,toggleProductWishlist)


router
     .route('/:id/account/bookings')
     .get(isLoggedIn , getUserBookings);

router
      .route('/:userId/:productId')
      .delete( isLoggedIn, cancelUserBooking);


router
     .route('/:id/account/edit')
     .put(isLoggedIn , upload.single("image"), validate(userEditValidationSchema) , editUserDetails);

router
     .route('/:id/account/delete')
     .delete(isLoggedIn , deleteUserAccount);


export default router;