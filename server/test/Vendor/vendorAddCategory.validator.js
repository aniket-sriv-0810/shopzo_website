// validators/addCategoryToVendorValidation.js
import Joi from "joi";

 const addCategoryToVendorValidation = Joi.object({
  title: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
  }),
  description: Joi.string().trim().allow("").max(500),
  image: Joi.any(),
  tag: Joi.string().trim().required().messages({
    "string.empty": "Tag is required",
  }),
});

export {addCategoryToVendorValidation};