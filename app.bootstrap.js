import "./Config/env.watcher.js";
import { serverPort } from "./Config/config.service.js";
import cors from "cors";
import helmet from "helmet";
import { resolve } from "node:path";
import express from "express";
import {
  dbConnect,
  globalErrorHandler,
  auth,
  users,
  redisConnect,
  cronJob,
  messages
} from "./Src/index.js";

export default async function bootstrap() {
  const app = express();

  // Daily Clean Up Job
  cronJob();
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization","authentication"],
      credentials: true,
    }),
  );
  app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, 
}));

  // File Parsing
  app.use(express.json());
  app.use("/uploads", express.static(resolve("../Uploads")));
  // DB Connection
  await dbConnect();
  await redisConnect();
  // Routing
  app.use("/auth", auth);
  app.use("/users", users);
  app.use("/messages",messages);
  //   Error Handler
  app.use(globalErrorHandler);
  //   Server Listen
  app.listen(serverPort, () => {
    console.log(`App is running on port ${serverPort} 🚀🚀`);
  });
}
