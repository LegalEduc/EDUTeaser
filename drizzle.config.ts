import { defineConfig } from "drizzle-kit";

const databaseUrl =
  process.env.DATABASE_URL?.trim() ||
  process.env.NETLIFY_DATABASE_URL?.trim();

if (!databaseUrl) {
  throw new Error(
    "Drizzle: .env에 DATABASE_URL 또는 NETLIFY_DATABASE_URL(Neon 연결 문자열)을 설정하세요. " +
      "예: netlify db init 후 복사하거나 Neon 대시보드의 Connection string."
  );
}

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
