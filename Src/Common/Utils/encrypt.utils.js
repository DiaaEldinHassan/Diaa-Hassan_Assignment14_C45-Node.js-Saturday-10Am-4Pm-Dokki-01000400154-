import crypto from "node:crypto";
import {
  encryption_sk,
  encryption_alg,
} from "../../../Config/config.service.js";
import { errorThrow } from "./index.js";

export function encryption(input) {
  const plainTexts = Array.isArray(input) ? input : [input];
  if (plainTexts.length === 0 || plainTexts[0] === undefined) {
    return [];
  }

  try {
    const encryptedItems = plainTexts.map((text) => {
      const textToEncrypt =
        typeof text === "string" ? text : JSON.stringify(text);

      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        encryption_alg,
        Buffer.from(encryption_sk, "hex"),
        iv,
      );

      let encrypted = cipher.update(textToEncrypt, "utf8", "hex");
      encrypted += cipher.final("hex");

      return {
        iv: iv.toString("hex"),
        data: encrypted,
      };
    });

    return encryptedItems;
  } catch (error) {
    errorThrow(500, `Encryption failed: ${error.message}`);
  }
}
