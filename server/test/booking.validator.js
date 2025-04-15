import Joi from "joi";

// Custom ObjectId validator
const objectId = (value, helpers) => {
  const isValid = /^[0-9a-fA-F]{24}$/.test(value);
  if (!isValid) return helpers.error("any.invalid");
  return value;
};

const bookingValidationSchema = Joi.object({
  user: Joi.string().custom(objectId).required().messages({
    "any.required": "User ID is required",
    "any.invalid": "Invalid User ID",
  }),

  vendor: Joi.string().custom(objectId).required().messages({
    "any.required": "Vendor ID is required",
    "any.invalid": "Invalid Vendor ID",
  }),

  product: Joi.string().custom(objectId).required().messages({
    "any.required": "Product ID is required",
    "any.invalid": "Invalid Product ID",
  }),

  category: Joi.string().custom(objectId).required().messages({
    "any.required": "Category ID is required",
    "any.invalid": "Invalid Category ID",
  }),

  sizeSelected: Joi.string().required().messages({
    "string.empty": "Size selection is required",
    "any.required": "Size selection is required",
  }),

  quantity: Joi.number().min(1).required().messages({
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be at least 1",
    "any.required": "Quantity is required",
  }),

  totalPrice: Joi.number().min(0).required().messages({
    "number.base": "Total price must be a number",
    "number.min": "Total price must be 0 or more",
    "any.required": "Total price is required",
  }),

  status: Joi.string().valid("pending", "cancelled", "completed").optional().messages({
    "any.only": "Status must be 'pending', 'cancelled' or 'completed'",
  }),

  bookingDate: Joi.date().optional(),
});

export { bookingValidationSchema };
