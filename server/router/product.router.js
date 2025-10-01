import express from 'express' ;
import { authenticateUser } from '../middleware/jwt.middleware.js';
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
     .post( authenticateUser  , validate(bookProductSchema) , bookProduct)

//provide all bookings associated with the particular product route
router
     .route("/:id/bookings")
     .get( authenticateUser , getAllBookings)

// delete a booking of a particular product
router
     .route("/:id/booking")
     .delete( authenticateUser , deleteBooking)

// Create delivery for a product
router.post("/:productId/delivery", authenticateUser, createDelivery);

// Get delivery confirmation
router.get("/delivery/:id/confirmation", authenticateUser, getDeliveryConfirmation);



export default router ;