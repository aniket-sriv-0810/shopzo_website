
import express from "express";
import {isLoggedIn} from '../middleware/auth.middleware.js'
import {validate} from '../middleware/validator.js';
import { contactSchemaValidation } from "../test/contact.validator.js";
import { faqData , createContactMessage , searchProducts} from "../controller/navigation.controller.js";
import { getBookingConfirmation } from "../controller/booking.controller.js";

const router = express.Router();

// CORE router - /api/navigation

router
     .route('/contact')
     .post(isLoggedIn , validate(contactSchemaValidation) , createContactMessage)

router
     .route('/faqs')
     .get(faqData)

router
     .route('/:bookingId/confirmation')
     .get(isLoggedIn , getBookingConfirmation)

router.get("/search-products", searchProducts);




export default router ;
