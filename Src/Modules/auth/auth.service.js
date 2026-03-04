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
  successThrow,
  UnauthorizedError,
  sendOtp,
  ttl,
  get,
  del,
  errorThrow,
  sendTempPassword,
  findAndUpdate,
} from "../../index.js";
import { passwordAttempts } from "../../Common/Utils/passAttempts.utils.js";

export async function signIn(data) {
  if (data.token) {
    const userData = await googleAuth(data.token);

    let user = await findOne({ email: userData.email });

    if (!user) {
      const randomPassword = crypto.randomUUID();

      user = await createNewOne({
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

    return successThrow(200, {
      token: { accessToken, refreshToken },
    });
  }

  if (!data.email || !data.password) throw new UnauthorizedError();

  const userEmail = await findOne({ email: data.email });
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

  return successThrow(200, { token: { accessToken, refreshToken } });
}

export async function signUp(data) {
  const emailCheck = await findOne({ email: data.email });
  if (emailCheck) {
    throw new AlreadyExist();
  }

  const phones = Array.isArray(data.phone) ? data.phone : [];
  data.phone = encryption(phones);

  try {
    const newUser = await createNewOne(data);
    const otp = await sendOtp(data.email);
    console.log(otp);
    return successThrow(201, newUser);
  } catch (error) {
    console.error(`Error message : ${error}`);
    throw error;
  }
}

export async function sendTemp(user) {
  try {
    let tempPass = Math.random().toString(36).slice(-8) + "A1";
    const plainTempPass = tempPass; 
    tempPass = await hashing(tempPass);
    await findAndUpdate(
      { email: user },
      { $set: { forgetPassword: tempPass } },
      { new: true },
    );
    await sendTempPassword(user, plainTempPass); 
    return successThrow(201, { message: "Temporary Password Sent" });
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}

export async function forgetPassword(userEmail, data) {
  try {

    const user = await findOne({ email: userEmail });

    if (!user) {
      errorThrow(404, "User not found");
    }

    if (!user.forgetPassword || user.forgetPassword === "") {
      errorThrow(400, "No temporary password was requested for this account.");
    }

    if (!data.tempPassword) {
      errorThrow(400, "Temporary password is required.");
    }

    const compare = await hashCompare(data.tempPassword, user.forgetPassword);

    if (!compare) {
      errorThrow(401, "Temporary password is incorrect.");
    }

    const hashedNewPassword = await hashing(data.newPassword);

    await findAndUpdate(
      { email: userEmail },
      { $set: { password: hashedNewPassword, forgetPassword: "" } },
      { new: true },
    );

    return successThrow(200, { message: "New Password Saved" });
  } catch (error) {
    if (error.status) throw error;
    errorThrow(500, error.message);
  }
}
