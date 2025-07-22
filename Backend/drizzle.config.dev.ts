import { defineConfig } from "drizzle-kit";
import { DrizzleConfig } from "drizzle-orm";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
export default defineConfig({
  out: "./drizzle/migrations-dev",
  schema: "./src/models/mysql/*.model.mysql.ts",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DB_MYSQL_URL as string,
  },
});
