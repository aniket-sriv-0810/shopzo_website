import Joi from "joi";
import { User } from "../models/user.model.js";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const userSchemaValidation = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Name is required!",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format.",
    "string.empty": "Email is required.",
    "any.required": "Email is required.",
  }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit number.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "string.empty": "Password is required.",
  }),

  image: Joi.any(),

  role: Joi.string().valid("admin", "user", "vendor").default("user").messages({
    "any.only": "Role must be either 'admin', 'user', or 'vendor'.",
  }),

  bookings: Joi.array().items(Joi.string().regex(objectIdPattern)).optional(),

  reviews: Joi.array().items(Joi.string().regex(objectIdPattern)).optional(),

  feedbacks: Joi.array().items(Joi.string().regex(objectIdPattern)).optional(),

  wishlists: Joi.array().items(Joi.string().regex(objectIdPattern)).optional(),

  vendorWishlists: Joi.array().items(Joi.string().regex(objectIdPattern)).optional(),
});

// ✅ Async uniqueness checks
const userSchemaWithAsyncChecks = userSchemaValidation.external(async (value) => {
  const emailExists = await User.findOne({ email: value.email });
  if (emailExists) {
    throw new Error("Email is already registered");
  }

  const phoneExists = await User.findOne({ phone: value.phone });
  if (phoneExists) {
    throw new Error("Phone number is already in use");
  }
});

export { userSchemaValidation, userSchemaWithAsyncChecks };
