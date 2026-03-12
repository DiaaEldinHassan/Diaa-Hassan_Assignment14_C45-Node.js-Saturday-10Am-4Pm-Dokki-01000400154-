import { NotFoundError, ValidationError } from "./index.js";

export function validation(schema) {
  return (req, res, next) => {

    try {
      if (!schema) throw new NotFoundError("Schema");
      const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        details: error.details.map((d) => d.message),
      });
    }
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function imageValidation(schema) {
  return (req,res,next) => {
    try {
      if (!schema) throw new NotFoundError("Schema");
      const { error, value } = schema.validate(req.file, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
        details: error.details.map((d) => d.message),
      });
    }
      req.body = value;
      next();
    } catch (error) {
      next(error);
    }
  }
}