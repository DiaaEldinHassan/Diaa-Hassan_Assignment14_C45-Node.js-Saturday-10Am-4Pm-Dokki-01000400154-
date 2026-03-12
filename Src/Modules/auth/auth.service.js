import crypto from "node:crypto";
import {
  AlreadyExist,
  createNewOne,
  encryption,
  findOne,
  generateToken,
  googleAuth,
  hashCompare,
  hashing,
  NotFoundError,
  UnauthorizedError,
  sendOtp,
  ttl,
  get,
  del,
  errorThrow,
  sendTempPassword,
  sendResetLink,
  findAndUpdate,
  usersModel,
} from "../../index.js";
import { passwordAttempts } from "../../Common/Utils/passAttempts.utils.js";

export async function signIn(data) {
  if (data.token) {
    const userData = await googleAuth(data.token);

    let user = await findOne(usersModel, { email: userData.email });

    if (!user) {
      const randomPassword = `TempPass${crypto.randomInt(1000, 9999)}!`;

      user = await createNewOne(usersModel, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        picture: userData.picture,
        password: randomPassword,
        gender: "Male",
        phone: [],
      });
    }

    const plainUser = user.toObject();
    delete plainUser.password;

    const accessToken = generateToken(plainUser, "access");
    const refreshToken = generateToken(plainUser, "refresh");

    return { accessToken, refreshToken };
  }

  if (!data.email || !data.password) throw new UnauthorizedError();

  const userEmail = await findOne(usersModel, { email: data.email });
  if (!userEmail) throw new NotFoundError("User Not Found");

  const isBlocked = await get(`RevokedUserPass:${data.email}`);
  if (isBlocked) {
    const remaining = await ttl(`RevokedUserPass:${data.email}`);
    errorThrow(429, `Account locked. Try again after ${remaining} seconds.`);
  }

  const passwordCompare = await hashCompare(data.password, userEmail.password);
  if (!passwordCompare) {
    await passwordAttempts(data.email);
    throw new UnauthorizedError();
  }

  await del(`userPass:${data.email}`);
  const user = userEmail.toObject();
  delete user.password;

  const accessToken = generateToken(user, "access");
  const refreshToken = generateToken(user, "refresh");

  return { accessToken, refreshToken };
}

export async function signUp(data) {
  const emailCheck = await findOne(usersModel, { email: data.email });
  if (emailCheck) {
    throw new AlreadyExist();
  }
  const phones = Array.isArray(data.phone) ? data.phone : [];
  data.phone = encryption(phones);
  try {
    const newUser = await createNewOne(usersModel, data);
    const otp = await sendOtp(data.email);
    return newUser;
  } catch (error) {
    console.error(`Error message : ${error}`);
    throw error;
  }
}

export async function sendTemp(user) {
  try {
    let tempPass = Math.random().toString(36).slice(-8) + "A1";
    const plainTempPass = tempPass;

    const hashedTempPass = await hashing(tempPass);

    await findAndUpdate(
      usersModel,
      { email: user },
      { $set: { forgetPassword: hashedTempPass } },
      { new: true },
    );

    await sendTempPassword(user, plainTempPass);
    return { message: "Temporary Password Sent" };
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}
export async function forgetPassword(userEmail, data) {
  try {
    const user = await findOne(usersModel, { email: userEmail });
    if (!user) errorThrow(404, "User not found");

    if (!user.forgetPassword || user.forgetPassword === "") {
      errorThrow(400, "No temporary password was requested for this account.");
    }

    if (!data.tempPassword) errorThrow(400, "Temporary password is required.");

    const compare = await hashCompare(data.tempPassword, user.forgetPassword);
    if (!compare) errorThrow(401, "Temporary password is incorrect.");

    await findAndUpdate(
      usersModel,
      { email: userEmail },
      { $set: { password: data.newPassword, forgetPassword: "" } },
      { new: true },
    );

    return { message: "New Password Saved" };
  } catch (error) {
    if (error.status) throw error;
    errorThrow(500, error.message);
  }
}


export async function createPasswordReset(email) {
  try {
    const user = await findOne(usersModel, { email });
    if (!user) throw new NotFoundError("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hashing(token);
    const expiresAt = Date.now() + 3600_000;

    await findAndUpdate(
      usersModel,
      { email },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordExpires: new Date(expiresAt),
        },
      },
      { new: true },
    );

    const clientUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const link = `${clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      email,
    )}`;

    await sendResetLink(email, link);
    return { message: "Password reset link sent",token: process.env.NODE_ENV==="development"?token:null };
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}

export async function resetPasswordWithToken(email, token, newPassword) {
  try {
    const user = await findOne(usersModel, { email });
    if (!user) throw new NotFoundError("User not found");

    if (
      !user.resetPasswordToken ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      errorThrow(400, "Reset token is invalid or expired");
    }

    const valid = await hashCompare(token, user.resetPasswordToken);
    if (!valid) {
      errorThrow(400, "Reset token is invalid");
    }

    await findAndUpdate(
      usersModel,
      { email },
      {
        $set: {
          password: newPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      },
      { new: true },
    );

    return { message: "Password updated" };
  } catch (error) {
    if (error.status) throw error;
    errorThrow(500, error.message);
  }
}
