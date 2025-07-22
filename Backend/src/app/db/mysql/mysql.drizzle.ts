import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import InfisicalLbirary from "@/library/Infisical-Library"; // sesuaikan lokasi
import * as AuthSchema from "@/models/mysql/Auth.model.mysql";
const isProduction = process.env.NODE_ENV === "production";

export const getInfesial = async () => {
  const secret = await InfisicalLbirary.getInfisical(
    process.env.SEACRET_VAR ?? ""
  );
  return secret.secretValue;
};
let pool: mysql.Pool;
let ssl = "";
if (isProduction) {
  getInfesial().then((value) => (ssl = value));

  pool = mysql.createPool({
    uri: process.env.DATABASE_URL_MYSQL,
    ssl: {
      ca: ssl, // penting untuk parse cert
    },
  });
} else {
  pool = mysql.createPool({
    uri: process.env.DATABASE_URL_MYSQL,
  });
}

export const db = drizzle(pool, {
  mode: "default",
  schema: {
    ...AuthSchema,
  },
});
