import Joi from "joi";

const productSchemaValidation = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Product title is required!",
  }),

  description: Joi.string().trim().required().messages({
    "string.empty": "Product description is required!",
  }),

  originalPrice: Joi.number().min(0).required().messages({
    "number.base": "Original price must be a number.",
    "number.min": "Original price must be a positive number.",
    "any.required": "Original price is required!",
  }),

  discountedPrice: Joi.number()
    .min(0)
    .required()
    .custom((value, helpers) => {
      const { originalPrice } = helpers.state.ancestors[0];
      if (originalPrice && value >= originalPrice) {
        return helpers.message("Discounted price must be less than original price");
      }
      return value;
    })
    .messages({
      "number.base": "Discounted price must be a number.",
      "number.min": "Discounted price must be a positive number.",
      "any.required": "Discounted price is required!",
    }),

  images: Joi.array()
    .items(Joi.string().uri().messages({ "string.uri": "Each image must be a valid URL." }))
    .max(7)
    .default([
      "https://media-hosting.imagekit.io//4bc72ff0889f4681/demo.png",
    ])
    .messages({
      "array.max": "A maximum of 7 images are allowed per product.",
    }),

  sizes: Joi.array()
    .items(Joi.string().valid("XS", "S", "M", "L", "XL", "XXL", "XXXL"))
    .default("M")
    .messages({
      "any.only": "Invalid size. Allowed: XS, S, M, L, XL, XXL, XXXL.",
    }),

  category: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid category ID format.",
      "any.required": "Product must belong to a category.",
    }),

  tag: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Tag must be either 'male' or 'female'.",
      "any.required": "Tag (male or female) is required.",
    }),

  vendor: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .required()
    .messages({
      "string.pattern.base": "Each vendor ID must be a valid ObjectId.",
      "any.required": "Vendor reference is required.",
    }),

  bookings: Joi.array()
    .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
    .optional(),
});

export { productSchemaValidation };
