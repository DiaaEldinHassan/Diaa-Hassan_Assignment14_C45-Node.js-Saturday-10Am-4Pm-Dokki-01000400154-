import { set, get, ttl, errorThrow, del } from "../../index.js";

const MAX_PASS_ATTEMPTS = 5;
const LOCKOUT_DURATION = 600;

export async function passwordAttempts(userEmail) {
  const attemptKey = `userPass:${userEmail}`;
  const lockKey = `RevokedUserPass:${userEmail}`;

  const isLocked = await get(lockKey);
  if (isLocked) {
    const remaining = await ttl(lockKey);
    errorThrow(429, `Too many attempts. Try again after ${remaining} seconds.`);
  }

  let currentAttempts = await get(attemptKey);
  currentAttempts = currentAttempts ? parseInt(currentAttempts) : 0;

  const newAttempts = currentAttempts + 1;

  if (newAttempts >= MAX_PASS_ATTEMPTS) {
    await set(lockKey, "Blocked", LOCKOUT_DURATION);
    await del(attemptKey);
    errorThrow(
      429,
      `Account locked. Try again in ${LOCKOUT_DURATION / 60} minutes.`,
    );
  } else {
    await set(`userPass:${userEmail}`, String(newAttempts), 600);
    const remaining = MAX_PASS_ATTEMPTS - newAttempts;
    errorThrow(
      401,
      `Invalid password. You have ${remaining} attempt${remaining === 1 ? "" : "s"} left.`,
    );
  }
}
