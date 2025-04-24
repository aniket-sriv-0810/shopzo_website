// validators/reviewValidation.js
import Joi from "joi";

// Custom ObjectId validator
const objectId = (value, helpers) => {
  const isValid = /^[0-9a-fA-F]{24}$/.test(value);
  if (!isValid) return helpers.error("any.invalid");
  return value;
};

const reviewSchemaValidation = Joi.object({
  user: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "User ID is required!",
      "any.invalid": "User ID must be a valid MongoDB ObjectId.",
    }),

  vendor: Joi.string()
    .custom(objectId)
    .required()
    .messages({
      "any.required": "Vendor ID is required!",
      "any.invalid": "Vendor ID must be a valid MongoDB ObjectId.",
    }),

  rating: Joi.number()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.base": "Rating must be a number.",
      "number.min": "Rating must be at least 1.",
      "number.max": "Rating cannot exceed 5.",
      "any.required": "Rating is required!",
    }),

  comment: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .required()
    .messages({
      "string.empty": "Comment can't be left empty! Please share your feedback!",
      "string.min": "Comment should be at least 5 characters long.",
      "string.max": "Comment can't exceed 200 characters.",
      "any.required": "Comment is required!",
    }),
});

export { reviewSchemaValidation };
