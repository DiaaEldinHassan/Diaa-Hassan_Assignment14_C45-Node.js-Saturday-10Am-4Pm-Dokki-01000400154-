import Joi from "joi";

const updateUserSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).messages({
    "string.min": "Username must be at least 3 characters long",
  }),
  lastName: Joi.string().alphanum().min(3).max(30).messages({
    "string.min": "Username must be at least 3 characters long",
  }),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "org", "io"] },
    })
    .lowercase(),

  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .min(8)
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),

  bio: Joi.string().max(200).allow("", null),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({ "string.pattern.base": "Please provide a valid phone number" }),
})
  .min(1)
  .messages({
    "object.min": "You must provide at least one field to update",
  });

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .min(8)
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .min(8)
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).messages({
    "any.only": "Passwords do not match",
  }),
});


export default updateUserSchema;
