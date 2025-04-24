// validators/contactValidation.js
import Joi from "joi";

const contactSchemaValidation = Joi.object({
  user: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
      "any.required": "User ID is required.",
    }),

  message: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required()
    .messages({
      "string.empty": "Message is required!",
      "string.min": "Message should be at least 5 characters.",
      "string.max": "Message cannot exceed 500 characters!",
    }),

  status: Joi.string()
    .valid("Pending", "Resolved")
    .optional()
    .messages({
      "any.only": "Status must be either 'Pending' or 'Resolved'.",
    }),
});

export { contactSchemaValidation };
