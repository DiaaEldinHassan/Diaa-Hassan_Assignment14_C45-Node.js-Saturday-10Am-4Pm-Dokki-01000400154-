import { client, errorThrow } from "../../index.js";
import { usersModel } from "../../index.js";

export async function incrementProfileView(userId) {
  await client.incr(`profile:views:${userId}`);

  await usersModel
    .findByIdAndUpdate(userId, { $inc: { views: 1 } })
    .catch(console.error);
}

export async function get(keyName) {
  try {
    return await client.get(keyName);
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}
export async function set(keyName, value, ttl = 600) {
  try {
    const parsedTtl = Number(ttl);
    if (!Number.isInteger(parsedTtl) || parsedTtl <= 0) {
      throw new Error("Invalid TTL value");
    }

    const valueToStore =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    await client.set(keyName, valueToStore, { EX: parsedTtl });
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}
export async function del(keyName) {
  try {
    await client.del(keyName);
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}

export async function ttl(keyName) {
  try {
    const time = await client.ttl(keyName);
    if (time <= 0) return 0;
    return time;
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}

export async function setWithPreserveTTL(keyName, value) {
  try {
    await client.set(keyName, value, { KEEPTTL: true });
  } catch (error) {
    errorThrow(error.status || 500, error.message);
  }
}
