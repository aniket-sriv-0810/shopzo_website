import Joi from "joi";

const objectIdPattern = /^[0-9a-fA-F]{24}$/;

const categorySchemaValidation = Joi.object({
  title: Joi.string().trim().required().messages({
    "string.empty": "Category title is required!",
  }),

  description: Joi.string().trim().optional(),

  // This will be handled by Multer, but included for completeness
  image: Joi.any().optional(),

  tag: Joi.string()
    .valid("male", "female")
    .required()
    .messages({
      "any.only": "Tag must be either 'male' or 'female'.",
      "any.required": "Tag (male or female) is required.",
    }),

  products: Joi.array()
    .items(Joi.string().pattern(objectIdPattern).message("Each product ID must be a valid ObjectId."))
    .optional(),

  // `vendors` is not accepted via create endpoint in your controller, so this can be omitted
});

export { categorySchemaValidation };
