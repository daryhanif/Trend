import { defineConfig } from "drizzle-kit";
import { DrizzleConfig } from "drizzle-orm";
import dotenv from "dotenv";
import InfisicalLbirary from "./src/library/Infisical-Library";
import { stringify } from "querystring";
dotenv.config({ path: ".env.production" });
const sslFromInfisical = InfisicalLbirary.getInfisical(
  "SSL_MYSQL_DARYHANIF_PROJECT"
);
export default defineConfig({
  out: "@/drizzle/migrations-prod",
  schema: "@/models/mysql/*.mysql.model.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL_MYSQL as string,
    ssl: {
      ca: (await sslFromInfisical).secretValue,
    },
  },
});
