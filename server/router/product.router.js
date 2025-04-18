import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {validate} from '../middleware/validator.js';

import { bookingValidationSchema } from '../test/booking.validator.js';
import {  getProductById } from "../controller/product.controller.js";
import { createBooking , getAllBookings , deleteBooking} from '../controller/booking.controller.js';
import { bookProduct } from '../controller/user.controller.js';

const router = express.Router();

// CORE router - /api/product

//check for the particular product Route
router
     .route("/:id")
     .get(getProductById)

router
     .route("/:productId/booking")
     .post( isLoggedIn  , bookProduct)

router
     .route("/:id/bookings")
     .get( isLoggedIn , getAllBookings)

router
     .route("/:id/booking")
     .delete( isLoggedIn , deleteBooking)



export default router ;