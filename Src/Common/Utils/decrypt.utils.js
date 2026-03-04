import {
  encryption_sk,
  encryption_alg,
} from "../../../Config/config.service.js";
import crypto from "node:crypto";
import { errorThrow, ValidationError } from "../../index.js";

export function decrypt(encryptedData = []) {
  if (!Array.isArray(encryptedData)) throw new ValidationError("Decryption");
  try {
    const decrypted = encryptedData.map((e) => {
      const ivBuffer = Buffer.from(e.iv, "hex");
      const keyBuffer = Buffer.from(encryption_sk, "hex");

      const decipher = crypto.createDecipheriv(
        encryption_alg,
        keyBuffer,
        ivBuffer,
      );

      let decryptedData = decipher.update(e.data, "hex", "utf8");
      decryptedData += decipher.final("utf8");

      return decryptedData;
    });

    return decrypted;
  } catch (error) {
    errorThrow(error.status, error.message);
  }
}
