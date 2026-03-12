import { Router } from "express";
import { authorization, role, success, validation } from "../../index.js";
import {
  signInSchema,
  signUpSchema,
  forgetPasswordSchema,
  sendTempPasswordSchema,
  forgotPasswordLinkSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  signIn,
  signUp,
  sendTemp,
  forgetPassword,
  createPasswordReset,
  resetPasswordWithToken,
} from "./index.js";
export const router = Router({
  mergeParams: true,
  strict: true,
  caseSensitive: true,
});

router.post("/signIn", validation(signInSchema), async (req, res, next) => {
  try {
    console.log(req.body);
    const token = await signIn(req.body);
    success(res, 200, { message: "Done Sign In", token });
  } catch (error) {
    next(error);
  }
});

router.post("/signUp", validation(signUpSchema), async (req, res, next) => {
  try {
    await signUp(req.body);
    success(res, 201, { message: "Done Sign Up" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/logout",
  authorization([role.User, role.Admin], "logout"),
  async (req, res, next) => {
    try {
      success(res, 200, { message: "Logout successful" });
    } catch (error) {
      next(error);
    }
  },
);

// Forget Password (temporary password flow)
router.post(
  "/temporaryPassword",
  validation(sendTempPasswordSchema),
  async (req, res, next) => {
    try {
      const temp = await sendTemp(req.body.email);
      success(res, 200, temp);
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  "/forgetPassword",
  validation(forgetPasswordSchema),
  async (req, res, next) => {
    try {
      const newPassword = await forgetPassword(req.body.email, req.body);
      success(res, 200, newPassword);
    } catch (error) {
      next(error);
    }
  },
);

// request one-time reset link
router.post(
  "/request-reset",
  validation(forgotPasswordLinkSchema),
  async (req, res, next) => {
    try {
      const result = await createPasswordReset(req.body.email);
      success(res, 200, result);
    } catch (error) {
      next(error);
    }
  },
);


router.post(
  "/reset-password",
  validation(resetPasswordSchema),
  async (req, res, next) => {
    try {
      const { email, token, newPassword } = req.body;
      const result = await resetPasswordWithToken(email, token, newPassword);
      success(res, 200, result);
    } catch (error) {
      next(error);
    }
  },
);


