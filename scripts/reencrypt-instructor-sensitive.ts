/**
 * 과거 ENCRYPTION_KEY로 저장된 주민번호·계좌 암호문을
 * 현재 키로 다시 암호화해 DB에 반영합니다.
 *
 * 사전 준비: Neon 백업 권장.
 *
 * 사용 예 (프로젝트 루트, .env.local에 DATABASE_URL·ENCRYPTION_KEY=현재키):
 *
 *   OLD_ENCRYPTION_KEY=<64자리hex> \
 *   REENCRYPT_NAMES="채다은,현승진,서성민" \
 *   npx tsx scripts/reencrypt-instructor-sensitive.ts --dry-run
 *
 *   # 문제 없으면 --dry-run 제거 후 재실행
 *
 * 연결 문자열: DATABASE_URL 또는 NETLIFY_DATABASE_URL
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, inArray } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import { instructors } from "../src/lib/schema";
import {
  decryptWithKey,
  encryptWithKey,
} from "../src/lib/encrypt";

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const namesEnv = process.env.REENCRYPT_NAMES?.trim();
  if (!namesEnv) {
    console.error(
      "REENCRYPT_NAMES 환경 변수에 쉼표로 구분된 이름을 넣으세요. 예: REENCRYPT_NAMES=\"채다은,현승진,서성민\""
    );
    process.exit(1);
  }
  const names = namesEnv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (names.length === 0) {
    console.error("REENCRYPT_NAMES에 유효한 이름이 없습니다.");
    process.exit(1);
  }
  return { dryRun, names };
}

function reencryptField(
  ciphertext: string,
  oldHex: string,
  newHex: string
): { value: string; skipped: boolean } {
  try {
    const plain = decryptWithKey(ciphertext, oldHex);
    return { value: encryptWithKey(plain, newHex), skipped: false };
  } catch {
    try {
      decryptWithKey(ciphertext, newHex);
      return { value: ciphertext, skipped: true };
    } catch {
      throw new Error(
        "구 키·신 키 모두로 복호화 실패 (손상·다른 키·평문 저장 등 의심)"
      );
    }
  }
}

async function main() {
  const { dryRun, names } = parseArgs();

  const oldHex = process.env.OLD_ENCRYPTION_KEY?.trim();
  const newHex =
    process.env.NEW_ENCRYPTION_KEY?.trim() ||
    process.env.ENCRYPTION_KEY?.trim();

  if (!oldHex) {
    console.error("OLD_ENCRYPTION_KEY(64자리 hex)가 필요합니다.");
    process.exit(1);
  }
  if (!newHex) {
    console.error(
      "NEW_ENCRYPTION_KEY 또는 ENCRYPTION_KEY(현재 운영 키, 64자리 hex)가 필요합니다."
    );
    process.exit(1);
  }
  if (oldHex.toLowerCase() === newHex.toLowerCase()) {
    console.error("OLD_ENCRYPTION_KEY와 새 키가 같습니다. 작업 불필요.");
    process.exit(1);
  }

  const databaseUrl =
    process.env.DATABASE_URL?.trim() ||
    process.env.NETLIFY_DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("DATABASE_URL 또는 NETLIFY_DATABASE_URL이 필요합니다.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const db = drizzle(sql, { schema });

  const rows = await db
    .select({
      id: instructors.id,
      name: instructors.name,
      residentNumber: instructors.residentNumber,
      accountNumber: instructors.accountNumber,
    })
    .from(instructors)
    .where(inArray(instructors.name, names));

  if (rows.length === 0) {
    console.error(
      `이름 일치 행이 없습니다: ${names.join(", ")} (DB의 name과 정확히 같은지 확인)`
    );
    process.exit(1);
  }

  const missing = names.filter(
    (n) => !rows.some((r) => r.name === n)
  );
  if (missing.length > 0) {
    console.warn("경고: 다음 이름은 조회되지 않았습니다:", missing.join(", "));
  }

  for (const row of rows) {
    console.log(`\n--- ${row.name} (${row.id}) ---`);
    let nextResident: string;
    let nextAccount: string;
    let skipRes: boolean;
    let skipAcc: boolean;

    try {
      const r = reencryptField(row.residentNumber, oldHex, newHex);
      nextResident = r.value;
      skipRes = r.skipped;
      const a = reencryptField(row.accountNumber, oldHex, newHex);
      nextAccount = a.value;
      skipAcc = a.skipped;
    } catch (e) {
      console.error("  실패:", e instanceof Error ? e.message : e);
      process.exitCode = 1;
      continue;
    }

    if (skipRes && skipAcc) {
      console.log("  이미 새 키로 암호화된 것으로 보임 — 건너뜀.");
      continue;
    }
    console.log(
      `  주민번호: ${skipRes ? "유지(이미 신키)" : "재암호화"}, 계좌: ${skipAcc ? "유지(이미 신키)" : "재암호화"}`
    );

    if (dryRun) {
      console.log("  [dry-run] DB UPDATE 생략");
      continue;
    }

    await db
      .update(instructors)
      .set({
        residentNumber: nextResident,
        accountNumber: nextAccount,
      })
      .where(eq(instructors.id, row.id));

    console.log("  UPDATE 완료");
  }

  console.log(dryRun ? "\n[dry-run 종료] 확정 시 --dry-run 없이 실행하세요." : "\n완료.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
