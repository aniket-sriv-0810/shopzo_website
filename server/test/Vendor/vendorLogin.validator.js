// ✅ Joi Validation for Vendor Login
import Joi from "joi";

const loginVendorValidation = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required.",
    "any.required": "Username is required.",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

export { loginVendorValidation };
