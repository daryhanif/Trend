import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
const redis = createClient({
  url: process.env.REDIS_URL,
});

export default redis;

redis.on("error", (err) => console.log("Redis Client Error", err));
