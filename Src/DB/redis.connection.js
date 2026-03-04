import { createClient } from "redis";
import { redis_url } from "../../Config/config.service.js";
import { errorThrow } from "../index.js";
export const client=createClient({url:redis_url})
export async function redisConnect() {
    try {
        await client.connect()
        console.log("Redis DB Connected Successfully 👌👌")
    } catch (error) {
        errorThrow(500,error.message);
    }
}