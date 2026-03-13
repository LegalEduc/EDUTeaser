import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors } from "@/lib/schema";
import { eq, count } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const db = getDb();

    const [appliedResult] = await db
      .select({ count: count() })
      .from(instructors)
      .where(eq(instructors.status, "applied"));

    const [consentSentResult] = await db
      .select({ count: count() })
      .from(instructors)
      .where(eq(instructors.status, "consent_sent"));

    const [consentedResult] = await db
      .select({ count: count() })
      .from(instructors)
      .where(eq(instructors.status, "consented"));

    return NextResponse.json({
      applied: appliedResult.count,
      consentSent: consentSentResult.count,
      consented: consentedResult.count,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
