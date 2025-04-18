// validators/editVendorValidation.js
import Joi from "joi";

export const editVendorValidation = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Name is required",
  }),
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
      "string.empty": "Phone is required",
    }),
  image: Joi.any(),

  address: Joi.object({
    area: Joi.string().required().messages({ "string.empty": "Area is required" }),
    city: Joi.string().required().messages({ "string.empty": "City is required" }),
    pincode: Joi.string().required().messages({ "string.empty": "Pincode is required" }),
    state: Joi.string().required().messages({ "string.empty": "State is required" }),
    country: Joi.string().required().messages({ "string.empty": "Country is required" }),
  }).required(),
});
