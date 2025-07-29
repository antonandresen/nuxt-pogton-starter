import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;