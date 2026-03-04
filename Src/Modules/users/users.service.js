import mongoose from "mongoose";
import crypto from "crypto";
import {
  errorThrow,
  findOne,
  NotFoundError,
  successThrow,
  findAndUpdate,
  verifyOtp,
  UnauthorizedError,

  incrementProfileView,

  sendOtp,
  ValidationError,
  hashCompare,
  AuthenticationError,

} from "../../index.js";
import { password } from "../../../Config/config.service.js";

export async function getUserData(user) {
  console.log(user);
  try {
    if (user.verified === false) {
      throw new UnauthorizedError(
        "User is Not authorized to access data until verification",
      );
    } else {
      const data = await findOne({ email: user.email });
      delete data.password;
      successThrow(200, data);
    }
  } catch (error) {
    throw new UnauthorizedError("User is Not verified or not Authorized");
  }
}

export async function updateProfilePicture(userId, pictureUrl) {
  const user = await findOne({ _id: new mongoose.Types.ObjectId(userId) });
  if (!user) throw new NotFoundError("User Not Found");
  user.picture = pictureUrl;
  await user.save({ validateModifiedOnly: true });

  const plain = user.toObject();
  delete plain.password;
  return plain;
}

export async function addVisitor(profileUserId, visitorUserId) {
  const user = await findOne({
    _id: new mongoose.Types.ObjectId(profileUserId),
  });
  if (!user) throw new NotFoundError("User Not Found");

  const visitorId = new mongoose.Types.ObjectId(visitorUserId);
  const alreadyVisited = user.visitors.some((v) => v.equals(visitorId));

  if (!alreadyVisited) {
    if (user.visitors.length >= 2) {
      user.visitors.shift();
    }
    user.visitors.push(visitorId);
    await user.save();
    incrementProfileView(profileUserId).catch(console.error);
  }

  return user.visitors;
}

export async function updateUserData(user, data) {
  try {
    const updateData = await findAndUpdate(
      { _id: new mongoose.Types.ObjectId(user._id) },
      { $set: data },
      { new: true },
    );
    return successThrow(201, updateData);
  } catch (error) {
    errorThrow(error.status, error.message);
  }
}

export async function otpVerification(user, submittedOtp) {
  const verify = await verifyOtp(user, submittedOtp);

  if (!verify) {
    throw new UnauthorizedError();
  }

  const verifyUser = await findAndUpdate(
    { email: user },
    { $set: { verified: true } },
    { new: true },
  );

  return successThrow(201, { message: "User Verified" });
}

export async function resendOtp(user) {
  try {
    await sendOtp(user);
    return successThrow(200, "Done Sending OTP");
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}

export async function updatePassword(user, passwords) {
  try {
    if (passwords.oldPassword === passwords.newPassword) {
      errorThrow(400, "Old password and new Password are the same");
    }
    const findUser = await findOne({ email: user.email });
    const verifyUserPassword = await hashCompare(
      passwords.oldPassword,
      findUser.password,
    );
    if (!verifyUserPassword) {
      throw new AuthenticationError("Wrong password");
    }
    await findAndUpdate(
      { email: user.email },
      { $set: { password: passwords.newPassword } },
      { new: true },
    );
    return successThrow(201, { message: "Password Updated" });
  } catch (error) {
    throw new ValidationError();
  }
}

