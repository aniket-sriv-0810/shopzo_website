import Joi from "joi";

const userEditValidationSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Name cannot be empty",
    "string.base": "Name must be a valid string.",
  }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email cannot be empty.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number.",
      "string.empty": "Phone number cannot be empty.",
    }),

  image: Joi.any()
});

export { userEditValidationSchema };
