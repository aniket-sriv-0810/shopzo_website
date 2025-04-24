// validations/vendorWishlistSchema.js

import Joi from "joi";

const toggleVendorWishlistSchema = Joi.object({
  vendorId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.base": "Vendor ID must be a string.",
      "string.length": "Vendor ID must be exactly 24 characters.",
      "string.hex": "Vendor ID must be a valid hex string.",
      "any.required": "Vendor ID is required.",
    }),
});

export { toggleVendorWishlistSchema };
