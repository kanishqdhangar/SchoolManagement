// db.js
import mysql from "mysql2/promise";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const sslOptions = process.env.DB_SSL === "true"
  ? {
      ssl: {
        ca: fs.readFileSync(process.env.DB_CA_PATH),
      },
    }
  : {};

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...sslOptions,
});
