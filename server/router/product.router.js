import express from 'express' ;
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {  getProductById } from "../controller/product.controller.js";
import {  getAllBookings , deleteBooking} from '../controller/booking.controller.js';
import { bookProduct } from '../controller/user.controller.js';
import { validate } from '../middleware/validator.js';
import { bookProductSchema } from '../test/User/userBooking.validator.js';
import { createDelivery, getDeliveryConfirmation } from '../controller/delivery.controller.js';
const router = express.Router();

// CORE router - /api/product

//provide details for the particular product Route
router
     .route("/:id")
     .get(getProductById)

//providing booking of a particular product
router
     .route("/:productId/booking")
     .post( isLoggedIn  , validate(bookProductSchema) , bookProduct)

//provide all bookings associated with the particular product route
router
     .route("/:id/bookings")
     .get( isLoggedIn , getAllBookings)

// delete a booking of a particular product
router
     .route("/:id/booking")
     .delete( isLoggedIn , deleteBooking)


// Place delivery order
router.post("/:productId/delivery", isLoggedIn, createDelivery);

// Get confirmation
router.get("/delivery/:id/confirmation", isLoggedIn, getDeliveryConfirmation);



export default router ;