import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = db
      .select({
        id: instructors.id,
        name: instructors.name,
        email: instructors.email,
        phone: instructors.phone,
        barExamType: instructors.barExamType,
        barExamDetail: instructors.barExamDetail,
        status: instructors.status,
        appliedAt: instructors.appliedAt,
      })
      .from(instructors)
      .orderBy(desc(instructors.appliedAt))
      .$dynamic();

    if (status && ["applied", "consent_sent", "consented"].includes(status)) {
      query = query.where(
        eq(instructors.status, status as "applied" | "consent_sent" | "consented")
      );
    }

    const result = await query;

    return NextResponse.json({ instructors: result });
  } catch (err) {
    console.error("Instructors list error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
