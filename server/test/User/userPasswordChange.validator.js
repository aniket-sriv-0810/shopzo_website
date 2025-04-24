import Joi from "joi";

const changeUserPasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required().messages({
    "string.empty": "Old password is required.",
    "string.min": "Old password must be at least 6 characters long.",
    "any.required": "Old password is required.",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required.",
    "string.min": "New password must be at least 6 characters long.",
    "any.required": "New password is required.",
  }),
});

export { changeUserPasswordSchema };
