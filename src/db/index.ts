// src/lib/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema"; // ✅ import the schema

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema }); // ✅ attach schema here
export { schema };
