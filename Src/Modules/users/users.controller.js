import { Router } from "express";
import { authorization, cloudFileUpload, imageValidation, role, success, validation } from "../../index.js";
import {
  updateProfilePicture,
  addVisitor,
  updateUserData,
  otpVerification,
  getUserData,
  resendOtp,
  updatePassword,
  get2FactorAuthenticationCode,
  verify2FactorAuthenticationCode,
} from "./index.js";
import updateUserSchema, { updatePasswordSchema } from "./update.validation.js";
import { imageFileSchema } from "../../Common/Multer/multer.validation.js";
export const router = Router({ mergeParams: true , strict: true, caseSensitive: true });

// Upload Profile Picture
router.post(
  "/uploadProfilePicture",
  cloudFileUpload({ size: 3 }).single("avatar"),
  imageValidation(imageFileSchema),
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
     const updatePhoto= await updateProfilePicture(req.file.buffer,req.user);
      success(res, 200,updatePhoto);
    } catch (error) {
      next(error);
    }
  },
);

// User Data
router.get(
  "/userData",
  authorization([role.Admin, role.User]),
  async (req, res, next) => {
    try {
      const data = await getUserData(req.user);
      success(res, 200, { message: "Authorized", data });
    } catch (error) {
      next(error);
    }
  },
);

// User Profile Visitors
router.post(
  "/visit/:profileId",
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
      const visitors = await addVisitor(req.params.profileId, req.user._id);
      success(res, 200, { visitors });
    } catch (error) {
      next(error);
    }
  },
);

// OTP Controllers
router.post(
  "/verifyOtp",
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
      const verify = await otpVerification(req.user.email, req.body.otp);
      success(res, 201, verify);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/resendOtp",
  authorization([role.User, role.Admin]),
  async (req, res, next) => {
    try {
      const otp = await resendOtp(req.user.email);
      success(res, 200, otp);
    } catch (error) {
      next(error);
    }
  },
);

// Update Controllers
router.patch(
  "/updatePassword",
  authorization([role.Admin, role.User]),
  validation(updatePasswordSchema),
  async (req, res, next) => {
    try {
      delete req.body.confirmPassword;
      const update = await updatePassword(req.user, req.body);
      success(res, 201, update);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/updateData",
  authorization([role.User, role.Admin]),
  validation(updateUserSchema),
  async (req, res, next) => {
    try {
      const user = await updateUserData(req.user, req.body);
      success(res, 201, user);
    } catch (error) {
      next(error);
    }
  },
);

// 2 Step Verification 2 FA Controllers
router.post("/2fa/init",authorization([role.User, role.Admin]),async (req,res,next) => {
  try {
    const verify=await get2FactorAuthenticationCode(req.user);
    success(res,200,verify)
  } catch (error) {
    next(error);
  }
})

router.post("/2fa/verify",authorization([role.User, role.Admin]),async (req,res,next) => {
  try {
    const verify=await verify2FactorAuthenticationCode(req.user,req.body.code);
    success(res,200,verify)
  } catch (error) {
    next(error);
  }
})