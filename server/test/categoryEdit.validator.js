// validators/editCategory.validator.js
import Joi from "joi";

const updateCategorySchemaValidation = Joi.object({
  title: Joi.string().trim().optional().messages({
    "string.empty": "Title cannot be empty.",
  }),

  description: Joi.string().trim().optional(),

  image: Joi.string()
    .uri()
    .optional()
    .messages({
      "string.uri": "Image must be a valid URL.",
    }),
});

export { updateCategorySchemaValidation };
