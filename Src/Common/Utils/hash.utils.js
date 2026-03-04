import bcrypt from "bcrypt";
import { salt_rounds } from "../../../Config/config.service.js";

export async function hashing(plainText) {
  const salt = parseInt(salt_rounds);
  return bcrypt.hash(plainText, salt);
}

export async function hashCompare(plainText, hashedText) {
  return bcrypt.compare(plainText, hashedText);
}
