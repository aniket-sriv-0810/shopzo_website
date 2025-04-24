// validations/productWishlistSchema.js

import Joi from "joi";

const toggleProductWishlistSchema = Joi.object({
  productId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.base": "Product ID must be a string.",
      "string.length": "Product ID must be exactly 24 characters.",
      "string.hex": "Product ID must be a valid hex string.",
      "any.required": "Product ID is required.",
    }),
});

export { toggleProductWishlistSchema };
