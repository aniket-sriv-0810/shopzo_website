// validators/updateProductPricesValidation.js
import Joi from "joi";

 const updateProductPricesValidation = Joi.object({
  originalPrice: Joi.number().positive().required().messages({
    "number.base": "Original price must be a number",
    "number.positive": "Original price must be greater than 0",
    "any.required": "Original price is required",
  }),
  discountedPrice: Joi.number().positive().required().messages({
    "number.base": "Discounted price must be a number",
    "number.positive": "Discounted price must be greater than 0",
    "any.required": "Discounted price is required",
  }),
}).custom((value, helpers) => {
  if (value.discountedPrice >= value.originalPrice) {
    return helpers.message("Discounted price must be less than original price");
  }
  return value;
});

export {updateProductPricesValidation};