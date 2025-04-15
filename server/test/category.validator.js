import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const categorySchemaValidation = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Category title is required!",
  }),

  description: Joi.string().trim().optional(),

  image: Joi.any(),

  tag: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Tag must be either 'male' or 'female'.",
      "any.required": "Tag (male or female) is required.",
    }),

  products: Joi.array()
    .items(Joi.string().regex(objectIdPattern))
    .optional()
    .messages({
      "string.pattern.base": "Each product ID must be a valid ObjectId.",
    }),

  vendors: Joi.array()
    .items(Joi.string().regex(objectIdPattern))
    .optional()
    .messages({
      "string.pattern.base": "Each vendor ID must be a valid ObjectId.",
    }),
});

export { categorySchemaValidation };
