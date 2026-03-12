import Joi from "joi";
import { gender, role } from "../../index.js";

export const signInSchema = Joi.alternatives()
  .try(
    Joi.object({
      email: Joi.string()
        .email()
        .pattern(
          /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
        )
        .required()
        .messages({
          "string.email": "Please enter a valid email address",
          "string.empty": "Email is required",
          "any.required": "Email is required",
        }),
      password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
    }),

    Joi.object({
      token: Joi.string().required().messages({
        "string.empty": "Google token is required",
        "any.required": "Google token is required",
      }),
    }),
  )
  .messages({
    "alternatives.match": "Provide either email & password or a Google token",
  });

export const signUpSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name must be at most 20 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().min(2).max(20).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name must be at most 20 characters",
    "any.required": "Last name is required",
  }),

  email: Joi.string()
    .email()
    .pattern(
      /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
    )
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .min(8)
    .max(24)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]).{8,24}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be at most 24 characters",
      "string.pattern.base":
        "Password must be at least 8 chars and at most 24 and consist one special char and one uppercase letter",
      "any.required": "Password is required",
    }),

  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Please confirm your password",
    "any.required": "Password confirmation is required",
  }),

  gender: Joi.string()
    .valid(gender?.Male, gender?.Female)
    .required()
    .messages({
      "any.only": `Gender must be ${gender?.Male} or ${gender?.Female}`,
      "any.required": "Gender is required",
    }),

  phone: Joi.array()
    .items(Joi.string().min(7).max(15).required())
    .min(1)
    .optional()
    .messages({
      "array.min": "At least one phone number is required",
      "string.min": "Phone number must be at least 7 digits",
      "string.max": "Phone number must be at most 15 digits",
    }),

  role: Joi.string().valid(role.Admin, role.User).default(role.User),

  termsAgreement: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the terms and conditions",
    "any.required": "Terms agreement is required",
  }),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(
      /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
    )
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
  tempPassword: Joi.string()
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

export const sendTempPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(
      /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
    )
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
});

// schema for requesting a one‑time reset link
export const forgotPasswordLinkSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(
      /^[a-zA-Z0-9,_+-]+@(gmail|yahoo|outlook|hotmail)\.(com|net)(\.edu|\.eg)?$/,
    )
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
      "any.required": "Email is required",
    }),
});

// schema for consuming reset link
export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  token: Joi.string().required().messages({
    "string.empty": "Token is required",
    "any.required": "Token is required",
  }),
  newPassword: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .min(8)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      "string.empty": "New password is required",
      "any.required": "New password is required",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "string.empty": "Please confirm your password",
      "any.required": "Password confirmation is required",
    }),
});
