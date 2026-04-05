/**
 * 로컬에서만 실행하세요. DB 연결 문자열과 OLD_ENCRYPTION_KEY는 터미널/쉘에 남을 수 있습니다.
 *
 * 용도: 과거에 쓰던 ENCRYPTION_KEY로 주민번호·계좌 암호문이 실제로 열리는지 확인합니다.
 * (채팅·AI에게 키를 붙여 넣지 마세요. 본인 PC 터미널에만 입력하세요.)
 *
 * 기본 출력: 마스킹된 요약만 (터미널 캡처 유출 완화)
 * 평문이 필요하면: 인자에 --plain (스크린 녹화·공유 PC 금지)
 *
 * 예시 (이름):
 *   DATABASE_URL="postgresql://..." \
 *   OLD_ENCRYPTION_KEY="<64자리hex>" \
 *   VERIFY_NAMES="채다은,현승진,서성민" \
 *   npx tsx scripts/verify-decrypt-old-key.ts
 *
 * 예시 (강사 UUID — 이름 중복 시):
 *   VERIFY_IDS="uuid1,uuid2" \
 *   ... 동일
 *
 * 선택: .env.local을 쓰려면 (Node 20+)
 *   node --env-file=.env.local node_modules/tsx/dist/cli.mjs scripts/verify-decrypt-old-key.ts
 *   단, OLD_ENCRYPTION_KEY는 .env.local에 넣지 말고 쉘에서만 export 권장.
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { inArray } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import { instructors } from "../src/lib/schema";
import { decryptWithKey } from "../src/lib/encrypt";
import { loadDotenvLocal } from "./loadDotenvLocal";

loadDotenvLocal();

function maskResident(plain: string): string {
  const digits = plain.replace(/\D/g, "");
  if (digits.length === 13) {
    return `${digits.slice(0, 6)}-*******`;
  }
  return `[복호화 성공, ${plain.length}자 — 형식이 일반 주민번호와 다름]`;
}

function maskAccount(plain: string): string {
  const t = plain.trim();
  if (t.length <= 4) return "****";
  return "*".repeat(Math.min(12, t.length - 4)) + t.slice(-4);
}

function parseTargets(): { names?: string[]; ids?: string[] } {
  const idsEnv = process.env.VERIFY_IDS?.trim();
  if (idsEnv) {
    const ids = idsEnv.split(",").map((s) => s.trim()).filter(Boolean);
    if (ids.length > 0) return { ids };
  }
  const namesEnv = process.env.VERIFY_NAMES?.trim();
  if (namesEnv) {
    const names = namesEnv.split(",").map((s) => s.trim()).filter(Boolean);
    if (names.length > 0) return { names };
  }
  console.error(
    "VERIFY_NAMES 또는 VERIFY_IDS(쉼표 구분) 환경 변수가 필요합니다."
  );
  process.exit(1);
}

function tryDecrypt(
  label: string,
  ciphertext: string,
  keyHex: string
): { ok: true; plain: string } | { ok: false; err: string } {
  try {
    const plain = decryptWithKey(ciphertext, keyHex);
    return { ok: true, plain };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, err: msg };
  }
}

async function main() {
  const showPlain = process.argv.includes("--plain");
  if (showPlain) {
    console.error(
      "\n[경고] --plain: 주민번호·계좌 평문이 터미널에 출력됩니다. 녹화·공유 환경에서 실행하지 마세요.\n"
    );
  }

  const oldHex = process.env.OLD_ENCRYPTION_KEY?.trim();
  if (!oldHex) {
    console.error("OLD_ENCRYPTION_KEY(64자리 hex)가 필요합니다.");
    process.exit(1);
  }

  const databaseUrl =
    process.env.DATABASE_URL?.trim() ||
    process.env.NETLIFY_DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error("DATABASE_URL 또는 NETLIFY_DATABASE_URL이 필요합니다.");
    process.exit(1);
  }

  const currentHex = process.env.ENCRYPTION_KEY?.trim();
  const target = parseTargets();

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
    .where(
      target.ids
        ? inArray(instructors.id, target.ids)
        : inArray(instructors.name, target.names!)
    );

  if (rows.length === 0) {
    console.error("조건에 맞는 강사 행이 없습니다. 이름 철자·VERIFY_IDS를 확인하세요.");
    process.exit(1);
  }

  console.log(`조회된 행: ${rows.length}건\n`);

  for (const row of rows) {
    console.log(`━━ ${row.name} (${row.id}) ━━`);

    const rOld = tryDecrypt("주민번호", row.residentNumber, oldHex);
    const aOld = tryDecrypt("계좌번호", row.accountNumber, oldHex);

    if (rOld.ok && aOld.ok) {
      console.log("  OLD_ENCRYPTION_KEY: 주민·계좌 모두 복호화 성공.");
      if (showPlain) {
        console.log("  [평문] 주민:", rOld.plain);
        console.log("  [평문] 계좌:", aOld.plain);
      } else {
        console.log("  (마스킹) 주민:", maskResident(rOld.plain));
        console.log("  (마스킹) 계좌:", maskAccount(aOld.plain));
      }
    } else {
      if (!rOld.ok) {
        console.log("  OLD 키 — 주민번호 복호화 실패:", rOld.err);
      }
      if (!aOld.ok) {
        console.log("  OLD 키 — 계좌번호 복호화 실패:", aOld.err);
      }
    }

    if (currentHex && currentHex.toLowerCase() !== oldHex.toLowerCase()) {
      const rCur = tryDecrypt("주민번호", row.residentNumber, currentHex);
      const aCur = tryDecrypt("계좌번호", row.accountNumber, currentHex);
      const bothCur = rCur.ok && aCur.ok;
      console.log(
        `  현재 ENCRYPTION_KEY(환경에 넣은 값): ${bothCur ? "이 행은 현재 키로도 복호화됨 (이미 마이그레이션됐거나 원래 현재 키로 저장됨)" : "이 행은 현재 키로는 복호화 안 됨 → 어드민에서 실패하는 패턴과 동일할 수 있음"}`
      );
    } else if (!currentHex) {
      console.log(
        "  (참고) ENCRYPTION_KEY를 같이 넣으면 ‘현재 키로도 열리는지’ 한 줄로 비교됩니다."
      );
    }

    console.log("");
  }

  console.log(
    "복호화가 OLD 키로만 성공했다면: npm run script:reencrypt-sensitive 로 현재 키에 맞게 DB를 갱신한 뒤, 어드민에서 다시 확인하세요."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
