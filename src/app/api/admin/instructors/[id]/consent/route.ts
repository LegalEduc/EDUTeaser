import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { consentSettings, instructors } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { randomUUID } from "crypto";
import { sendConsentLink } from "@/lib/email";

export async function POST(
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
    const body = await request.json();

    if (!body.lectureTopic?.trim()) {
      return NextResponse.json(
        { message: "강의 주제를 입력해 주세요." },
        { status: 400 }
      );
    }
    if (!body.feeAmount || body.feeAmount <= 0) {
      return NextResponse.json(
        { message: "강사료를 입력해 주세요." },
        { status: 400 }
      );
    }

    // 강사 존재 확인
    const [instructor] = await db
      .select({ id: instructors.id, name: instructors.name, email: instructors.email })
      .from(instructors)
      .where(eq(instructors.id, id))
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { message: "강사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const consentToken = randomUUID();

    // 동의서 세팅 저장
    await db.insert(consentSettings).values({
      instructorId: id,
      lectureTopic: body.lectureTopic.trim(),
      feeAmount: body.feeAmount,
      specialTerms: body.specialTerms?.trim() || null,
      token: consentToken,
    });

    // 상태 업데이트
    await db
      .update(instructors)
      .set({ status: "consent_sent" })
      .where(eq(instructors.id, id));

    // 강사에게 동의서 링크 이메일 발송 (비동기)
    sendConsentLink(instructor.email, instructor.name, consentToken).catch(
      (err) => console.error("Consent link email error:", err)
    );

    return NextResponse.json(
      { success: true, token: consentToken },
      { status: 201 }
    );
  } catch (err) {
    console.error("Consent setting error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
