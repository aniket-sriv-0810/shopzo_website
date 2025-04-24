import Joi from "joi";

const editProductSchemaValidation = Joi.object({
  title: Joi.string().trim().optional().messages({
    "string.empty": "Product title cannot be empty.",
  }),

  description: Joi.string().trim().optional().messages({
    "string.empty": "Product description cannot be empty.",
  }),

  price: Joi.number().min(0).optional().messages({
    "number.base": "Product price must be a number.",
    "number.min": "Price must be a positive number.",
  }),

  sizes: Joi.alternatives().try(
    Joi.array().items(
      Joi.string().valid("XS", "S", "M", "L", "XL", "XXL", "XXXL")
    ),
    Joi.string().valid("XS", "S", "M", "L", "XL", "XXL", "XXXL")
  ).optional(),

  tag: Joi.string()
    .valid("male", "female")
    .optional()
    .messages({
      "any.only": "Tag must be either 'male' or 'female'.",
    }),

  imagesToKeep: Joi.string().optional(), // Should be a JSON.stringified array from frontend
});

export { editProductSchemaValidation };
