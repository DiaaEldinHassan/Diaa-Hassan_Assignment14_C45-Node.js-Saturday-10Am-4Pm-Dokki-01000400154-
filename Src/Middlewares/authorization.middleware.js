import { role } from "../index.js";
import {
  UnauthorizedError,
  verifyToken,
  set,
  get,
  findById,
  usersModel,
} from "../index.js";

import jwt from "jsonwebtoken";

export function authorization(aud = [role.User], process = "login") {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization || req.headers.Authorization;
      if (!header) throw new UnauthorizedError("Please provide token");

      const token = header.split(" ")[1];

      if (process === "login") {
        const isRevoked = await get(`revoked:${token}`);
        if (isRevoked) {
          throw new UnauthorizedError(
            "Token has been revoked. Please login again.",
          );
        }

        const decoded = verifyToken(token);
        if (!aud.includes(decoded.role))
          throw new UnauthorizedError("Forbidden");

        const user = await findById(usersModel, decoded._id);
        if (!user) {
          throw new UnauthorizedError(
            "User no longer exists. Please register again.",
          );
        }

        req.user = decoded;
        next();
      } else {
        const decoded = jwt.decode(token);
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;

        if (ttl > 0) {
          await set(`revoked:${token}`, "true", ttl);
        }

        return res.status(200).json({ message: "Logged out successfully" });
      }
    } catch (error) {
      next(error);
    }
  };
}
