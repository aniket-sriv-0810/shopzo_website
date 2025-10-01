
import express from "express";
import {authenticateUser} from '../middleware/jwt.middleware.js'
import {validate} from '../middleware/validator.js';
import { contactSchemaValidation } from "../test/User/userContact.validator.js";
import { faqData , createContactMessage , searchAll} from "../controller/navigation.controller.js";
import { getBookingConfirmation } from "../controller/booking.controller.js";

const router = express.Router();

// CORE router - /api/navigation

// sending feedback route
router
     .route('/contact')
     .post(authenticateUser , validate(contactSchemaValidation) , createContactMessage)

//fetching all the faqs route
router
     .route('/faqs')
     .get(faqData)

//provide the booking confirmation route
router
     .route('/:bookingId/confirmation')
     .get(authenticateUser , getBookingConfirmation)

// searching for products & vendors route
router
      .route("/search-all")
      .get(searchAll);




export default router ;
