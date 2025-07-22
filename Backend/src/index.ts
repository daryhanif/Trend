import express from "express";
import "dotenv/config";
import dotenv from "dotenv";
import cors from "cors";
import redis from "./app/redis/redis.config";
import routerAuth from "@/routes/Auth.route";
import { JwtHelpers } from "@/helpers/Jwt.helpers";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "X-CLIENT",
    ],
  })
);

const StartServer = async () => {
  await redis.connect();
  const tokenAccsess = await JwtHelpers.createToken(
    {
      id: "asem",
    },
    {
      typeToken: "access",
      algo: "RS256",
      exp: "1d",
    }
  );
  app.listen(3000, () => {
    console.log("Server is running on port 3000" + tokenAccsess);
  });

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  app.use("/api/auth", routerAuth);
};

StartServer();
