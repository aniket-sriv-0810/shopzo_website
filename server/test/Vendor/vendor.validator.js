import Joi from "joi";
import { Vendor } from "../../models/vendor.model.js";

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const vendorSchemaValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required!",
  }),

  username: Joi.string()
    .trim()
    .required()
    .lowercase()
    .custom(async (value, helper) => {
      const exists = await Vendor.findOne({ username: value });
      if (exists) return helper.message("Username is already taken.");
      return value;
    })
    .messages({
      "string.empty": "Username is required!",
    }),

  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .custom(async (value, helper) => {
      const exists = await Vendor.findOne({ email: value });
      if (exists) return helper.message("Email is already registered.");
      return value;
    })
    .messages({
      "string.email": "Invalid email format.",
      "string.empty": "Email is required.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .custom(async (value, helper) => {
      const exists = await Vendor.findOne({ phone: value });
      if (exists) return helper.message("Phone number is already in use.");
      return value;
    })
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit number.",
      "string.empty": "Phone number is required.",
    }),

  address: Joi.object({
    area: Joi.string().trim().required().messages({ "string.empty": "Area is required!" }),
    city: Joi.string().trim().required().messages({ "string.empty": "City is required!" }),
    pincode: Joi.string().trim().required().messages({ "string.empty": "Pincode is required!" }),
    state: Joi.string().trim().required().messages({ "string.empty": "State is required!" }),
    country: Joi.string().trim().required().messages({ "string.empty": "Country is required!" }),
  }).required(),

  image: Joi.any(),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
  }),

  role: Joi.string().valid("vendor").default("vendor").messages({
    "any.only": "Role must be 'vendor'.",
  }),

  products: Joi.array().items(objectId).optional(),

  categories: Joi.array().items(objectId).optional(),

  reviews: Joi.array().items(objectId).optional(),

  vendor_wishlists: Joi.array().items(objectId).optional(),

  bookings: Joi.array()
    .items(objectId)
    .optional(),
});

export { vendorSchemaValidation };
