import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

/** .env.local 후 .env.reencrypt.local (마이그레이션 전용, gitignore 권장). */
export function loadDotenvLocal(): void {
  for (const name of [".env.local", ".env.reencrypt.local"]) {
    const envPath = resolve(process.cwd(), name);
    if (existsSync(envPath)) {
      config({ path: envPath, override: false });
    }
  }
}
