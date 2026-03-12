import {
  errorThrow,
  generateOtp,
  template,
  set,
  get,
  del,
  ttl,
  setWithPreserveTTL,

} from "../../index.js";

const MAX_ATTEMPTS = 3;
const REVOKE_DURATION = 600;


export async function verifyOtp(receiver, submittedOtp) {
  const otpKey = `OTP:${receiver}`;
  const revokedKey = `RevokedOtp:${receiver}`;

  const isRevoked = await get(revokedKey);
  if (isRevoked) {
    const remaining = await ttl(revokedKey);
    errorThrow(
      429,
      `You are not allowed to request another OTP for ${remaining} seconds.`,
    );
  }

  const raw = await get(otpKey);
  if (!raw) {
    errorThrow(410, "OTP expired or never issued.");
  }

  const payload = JSON.parse(raw);

  if (payload.attempts >= MAX_ATTEMPTS) {
    await set(revokedKey, "blocked", REVOKE_DURATION);
    await del(otpKey);

    errorThrow(
      429,
      `Too many failed attempts. Try again after ${REVOKE_DURATION} seconds.`,
    );
  }

  if (String(payload.otp) !== String(submittedOtp)) {
    payload.attempts += 1;

    await setWithPreserveTTL(otpKey, JSON.stringify(payload));

    const remainingAttempts = MAX_ATTEMPTS - payload.attempts;

    errorThrow(
      401,
      `Invalid OTP. ${remainingAttempts} attempt${
        remainingAttempts === 1 ? "" : "s"
      } remaining.`,
    );
  }
  await del(otpKey);
  return true;
}