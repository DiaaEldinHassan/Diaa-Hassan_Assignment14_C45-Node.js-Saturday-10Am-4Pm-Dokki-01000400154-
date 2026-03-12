import "./Config/env.watcher.js";
import { serverPort } from "./Config/config.service.js";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { resolve } from "node:path";
import express from "express";
import {
  dbConnect,
  globalErrorHandler,
  auth,
  users,
  redisConnect,
  cronJob,
  messages,
  visitorsCleaner,
} from "./Src/index.js";

export default async function bootstrap() {
  const app = express();
  // Rate Limiter
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    legacyHeaders: false,
    handler: (req, res, next) => {
      return res.status(429).json({
        success: false,
        message: "Too many requests, please try again later",
      });
    }
  });
  // Daily Clean Up Job
  cronJob();
  visitorsCleaner();

  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "authentication"],
      credentials: true,
    }),
    helmet(),
    limiter,
    express.json(),
  );

  // DB Connection
  await dbConnect();
  await redisConnect();
  // Routing
  app.use("/auth", auth);
  app.use("/users", users);
  app.use("/messages", messages);
  //   Error Handler
  app.use(globalErrorHandler);
  //   Server Listen
  app.listen(serverPort, () => {
    console.log(`App is running on port ${serverPort} 🚀🚀`);
  });
}
