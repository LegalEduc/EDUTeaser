import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import {
  instructorsListSelectFull,
  instructorsListSelectLegacy,
  isMissingFeeLimitCheckColumnError,
} from "@/lib/instructor-db-compat";
import { instructorHasProfilePhoto } from "@/lib/instructor-photo";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const statusFilter =
      status && ["applied", "consent_sent", "consented"].includes(status)
        ? status
        : null;

    const buildQuery = (legacy: boolean) => {
      const shape = legacy ? instructorsListSelectLegacy : instructorsListSelectFull;
      let query = db
        .select(shape)
        .from(instructors)
        .leftJoin(consentSettings, eq(consentSettings.instructorId, instructors.id))
        .leftJoin(consentSignatures, eq(consentSignatures.instructorId, instructors.id))
        .orderBy(desc(instructors.appliedAt))
        .$dynamic();

      if (statusFilter) {
        query = query.where(
          eq(
            instructors.status,
            statusFilter as "applied" | "consent_sent" | "consented"
          )
        );
      }
      return query;
    };

    let result;
    try {
      result = await buildQuery(false);
    } catch (err) {
      if (!isMissingFeeLimitCheckColumnError(err)) throw err;
      console.warn(
        "instructors list: fee_limit_check_needed 컬럼 없음 — 구 스키마로 재조회합니다. DB에 컬럼을 추가하세요:",
        "scripts/ensure-fee-limit-check-column.sql"
      );
      const legacyRows = await buildQuery(true);
      result = legacyRows.map((row) => ({
        ...row,
        feeLimitCheckNeeded: null as boolean | null,
      }));
    }

    const instructorsWithPhoto = await Promise.all(
      result.map(async (row) => ({
        ...row,
        hasProfilePhoto: await instructorHasProfilePhoto(row.id),
      }))
    );

    return NextResponse.json({ instructors: instructorsWithPhoto });
  } catch (err) {
    console.error("Instructors list error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
