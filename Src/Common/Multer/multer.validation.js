import Joi from "joi";

const ALLOWED_IMAGE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

const fileSchema = (allowedTypes, maxSize) =>
  Joi.object({
    fieldname:    Joi.string().required(),
    originalname: Joi.string().required(),
    encoding:     Joi.string().required(),
    mimetype:     Joi.string()
                    .valid(...allowedTypes)
                    .required()
                    .messages({ "any.only": `Only ${allowedTypes.join(", ")} are allowed` }),
    size:         Joi.number()
                    .max(maxSize * 1024 * 1024)
                    .required()
                    .messages({ "number.max": `File size must be less than ${maxSize}MB` }),
    buffer:       Joi.binary().required(), 
  });

export const imageFileSchema = fileSchema(ALLOWED_IMAGE_TYPES, 3);