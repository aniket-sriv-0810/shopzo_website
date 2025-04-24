// validations/bookProductSchema.js

import Joi from "joi";

const bookProductSchema = Joi.object({
  sizeSelected: Joi.string()
    .valid("XS", "S", "M", "L", "XL", "XXL", "XXXL")
    .required()
    .messages({
      "any.only": "Size must be one of XS, S, M, L, XL, XXL, XXXL",
      "any.required": "Size selection is required",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Quantity must be a number",
      "number.min": "Quantity must be at least 1",
      "any.required": "Quantity is required",
    }),
});

export { bookProductSchema };
