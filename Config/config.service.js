import { config } from "dotenv";
import {resolve} from "node:path"
config({path: resolve("Config/.env.development")});


// SERVER PORT CONFIGURATION
export const serverPort= process.env.PORT;
// JWT SECRET KEYS
export const access_sk=process.env.JWT_ACCESS_SK;
export const refresh_sk=process.env.JWT_REFRESH_SK;
// ENCRYPTION CONFIGURATION
export const encryption_sk=process.env.ENCRYPTION_KEY;
export const encryption_alg=process.env.ENCRYPTION_ALGORITHM;
// DB CONFIGURATION
export const db_uri=process.env.DB_URI;
// Hashing Configuration
export const salt_rounds=process.env.SALT_ROUNDS;
// Google Configuration
export const clientId=process.env.CLIENT_ID
// Redis Configuration
export const redis_url=process.env.REDIS_URL;
// Nodemailer Configuration
export const account=process.env.ACCOUNT;
export const password=process.env.PASSWORD;
