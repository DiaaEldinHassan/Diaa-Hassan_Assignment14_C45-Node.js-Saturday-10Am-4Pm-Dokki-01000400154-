import mongoose from "mongoose";
import speakeasy from "speakeasy";
import  QrCode  from "qrcode";
import {
  errorThrow,
  findOne,
  NotFoundError,
  successThrow,
  findAndUpdate,
  verifyOtp,
  UnauthorizedError,
  incrementProfileView,
  ValidationError,
  hashCompare,
  AuthenticationError,
  uploadToCloudinary,
  findById,
  usersModel,
  deleteFromCloudinary,
  sendOtp,
  sendQrCode,
  hashing,
} from "../../index.js";

export async function getUserData(user) {
  try {
    if (user.verified === false) {
      throw new UnauthorizedError(
        "User is Not authorized to access data until verification",
      );
    } else {
      const data = await findOne(usersModel, { email: user.email });
      const plain = data.toObject();
      delete plain.password;
      return plain;
    }
  } catch (error) {
    throw new UnauthorizedError("User is Not verified or not Authorized");
  }
}

export async function updateProfilePicture(file, user) {
  try {
    console.log(user);
    if (user.public_id) {
      await deleteFromCloudinary(user.public_id);
    }
    const result = await uploadToCloudinary(file, user._id);
    await findById(usersModel, user._id, true, {
      picture: result.secure_url,
      publicId: result.public_id,
    });
    return successThrow(200, "Done Updating Profile Picture");
  } catch (error) {
    errorThrow(error.status || 500, error.message || "Cloudinary Error");
  }
}

export async function addVisitor(profileUserId, visitorUserId) {
  const user = await findOne(usersModel, {
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
    await user.save({ validateBeforeSave: false });
    incrementProfileView(profileUserId).catch(console.error);
  }

  return user.visitors;
}

export async function updateUserData(user, data) {
  try {
    const updateData = await findAndUpdate(
      usersModel,
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

  await findAndUpdate(
    usersModel,
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

    const findUser = await findOne(usersModel, { email: user.email });
    const verifyUserPassword = await hashCompare(
      passwords.oldPassword,
      findUser.password,
    );
    if (!verifyUserPassword) {
      throw new AuthenticationError("Wrong password");
    }
    await findAndUpdate(
      usersModel,
      { email: user.email },
      { $set: { password: passwords.newPassword } },
      { new: true },
    );
    return successThrow(201, { message: "Password Updated" });
  } catch (error) {
    errorThrow(error.status || 500, error.message);
    throw new ValidationError();
  }
}

export async function get2FactorAuthenticationCode(user) {
  try { 

    const checkAuth= await findById(usersModel,user._id);
    if(checkAuth.twoFactorEnabled){
      throw new ValidationError("2FA Already Enabled");
    }
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Sarahah ${user.firstName} ${user.lastName}`,
    });
    await findById(usersModel, user._id, true, {
      twoFactorKey: secret.base32,
    });
    const qrcode = await QrCode.toDataURL(secret.otpauth_url);
    await sendQrCode(user.email, qrcode, secret.base32);
    return successThrow(200,{message:"Done Sending Authentication Code"});
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}


export async function verify2FactorAuthenticationCode(user, token) {
  try {
    const findUser = await findOne(usersModel, { email: user.email });

    const isValid = speakeasy.totp.verify({
      secret: findUser.twoFactorKey,  
      encoding: "base32",
      token: String(token),        
      window: 2,
    });

    if (!isValid) throw new UnauthorizedError("Wrong Authentication Code");

    await findById(usersModel, user._id, true, {
      twoFactorKey: null,
      twoFactorEnabled: true,
    });

    return successThrow(200, { message: "Done Verifying Authentication Code" });
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}