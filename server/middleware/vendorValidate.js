// middlewares/validate.js
import { ApiError } from "../utils/ApiError.js";

const validateVendor = (schema) => (req, res, next) => {
  try {
    // Handle FormData field names like address[area]
    if (req.body["address[area]"]) {
      req.body.address = {
        area: req.body["address[area]"],
        city: req.body["address[city]"],
        pincode: req.body["address[pincode]"],
        state: req.body["address[state]"],
        country: req.body["address[country]"],
      };

      // Clean up the old flat fields
      delete req.body["address[area]"];
      delete req.body["address[city]"];
      delete req.body["address[pincode]"];
      delete req.body["address[state]"];
      delete req.body["address[country]"];
    }

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((d) => d.message).join(", ");
      return res.status(400).json(new ApiError(400, errors));
    }

    next();
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export  {validateVendor};
