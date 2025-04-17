import Joi from "joi";

const userEditValidationSchema = Joi.object({
  name: Joi.string().trim().optional().messages({
    "string.empty": "Name cannot be empty",
  }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Invalid email format",
      "string.empty": "Email cannot be empty",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Phone number must be a valid 10-digit number",
      "string.empty": "Phone number cannot be empty",
    }),

  image: Joi.any()
});

export { userEditValidationSchema };
