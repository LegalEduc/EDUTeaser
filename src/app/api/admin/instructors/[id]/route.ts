import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { maskResident, maskAccount } from "@/lib/encrypt";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getDb();

    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.id, id))
      .limit(1);

    if (!instructor) {
      return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
    }

    // 동의서 세팅 조회
    const [consentSetting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.instructorId, id))
      .limit(1);

    // 서명 조회
    let consentSignature = null;
    if (consentSetting) {
      const [sig] = await db
        .select()
        .from(consentSignatures)
        .where(eq(consentSignatures.consentSettingId, consentSetting.id))
        .limit(1);
      consentSignature = sig || null;
    }

    return NextResponse.json({
      instructor: {
        ...instructor,
        residentNumber: maskResident(instructor.residentNumber),
        accountNumber: maskAccount(instructor.accountNumber),
      },
      consentSetting: consentSetting || null,
      consentSignature: consentSignature,
    });
  } catch (err) {
    console.error("Instructor detail error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
