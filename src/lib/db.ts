import { neon } from "@netlify/neon";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (!_db) {
    const sql = neon();
    _db = drizzle(sql, { schema });
  }
  return _db;
}
