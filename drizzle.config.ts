/**
 * @fileoverview Drizzle Kit configuration for database migrations
 * @grep_search drizzle, config, migrations
 * 
 * Configures Drizzle Kit for schema generation and migrations
 */

import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export default {
  schema: "./server/core/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;

