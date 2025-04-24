// validators/updateBookingStatusValidation.js
import Joi from "joi";

 const updateBookingStatusValidation = Joi.object({
  status: Joi.string()
    .valid("pending", "cancelled", "completed")
    .required()
    .messages({
      "any.only": "Status must be one of: pending, cancelled, completed",
      "string.empty": "Status is required",
    }),
});

export {updateBookingStatusValidation};