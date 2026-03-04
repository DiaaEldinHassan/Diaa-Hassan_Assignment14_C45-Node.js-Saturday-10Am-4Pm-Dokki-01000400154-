import { Router } from "express";
import { uploadAvatar } from "../../Middlewares/upload.middleware.js";
import { authorization, role, success, validation } from "../../index.js";
import {
  updateProfilePicture,
  addVisitor,
  updateUserData,
  otpVerification,
  getUserData,
  resendOtp,
  updatePassword,

} from "./index.js";
import updateUserSchema, { updatePasswordSchema } from "./update.validation.js";
export const router = Router();

// Upload Profile Picture
router.post(
  "/avatar",
  authorization([role.User, role.Admin]),
  uploadAvatar.single("avatar"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file provided" });
      }

      const url = `/uploads/${req.file.filename}`;
      const user = await updateProfilePicture(req.user._id, url);
      success(res, 200, user);
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
router.patch("/updatePassword",authorization([role.Admin,role.User]),validation(updatePasswordSchema),async (req,res,next) => {
  try {
    delete req.body.confirmPassword;
    const update=await updatePassword(req.user,req.body);
  } catch (error) {
    next(error);
  }
})

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

