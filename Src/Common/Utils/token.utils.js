import jwt from "jsonwebtoken";
import { access_sk, refresh_sk } from "../../../Config/config.service.js";
import { NotFoundError, UnauthorizedError } from "../../index.js";

export function generateToken(data, type) {
  if (!data) throw new NotFoundError("Data");


  const payload = typeof data.toObject === "function" ? data.toObject() : { ...data };
  delete payload.password;



  switch (type) {
    case "access":
      return jwt.sign(payload, access_sk,  { expiresIn: "15m" });
    case "refresh":
      return jwt.sign(payload, refresh_sk, { expiresIn: "7d"  });
    default:
      throw new Error(`Unknown token type: ${type}`);
  }
}

export function verifyToken(token, type = "access") {
  if (!token) throw new NotFoundError("Token");
  try {
    const secret = type === "refresh" ? refresh_sk : access_sk;
    return jwt.verify(token, secret); 
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new UnauthorizedError("Token expired");
    throw new UnauthorizedError("Invalid token");
  }
}