import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { consentSettings, consentSignatures, instructors } from "@/lib/schema";
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

    // 강사에게 동의서 링크 이메일 발송
    try {
      await sendConsentLink(instructor.email, instructor.name, consentToken);
    } catch (emailErr) {
      console.error("Consent link email error:", emailErr);
      // 이메일 실패해도 세팅은 저장됨 — 재발송으로 다시 시도 가능
    }

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

// PUT: 동의서 이메일 재발송
export async function PUT(
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
      .select({ id: instructors.id, name: instructors.name, email: instructors.email, status: instructors.status })
      .from(instructors)
      .where(eq(instructors.id, id))
      .limit(1);

    if (!instructor) {
      return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
    }

    if (instructor.status === "consented") {
      return NextResponse.json({ message: "이미 서명 완료된 강사입니다." }, { status: 400 });
    }

    const [setting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.instructorId, id))
      .limit(1);

    if (!setting) {
      return NextResponse.json({ message: "동의서 세팅이 없습니다." }, { status: 404 });
    }

    await sendConsentLink(instructor.email, instructor.name, setting.token);

    return NextResponse.json({ success: true, message: "이메일이 재발송되었습니다." });
  } catch (err) {
    console.error("Consent resend error:", err);
    return NextResponse.json(
      { message: `이메일 발송에 실패했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}` },
      { status: 500 }
    );
  }
}

// DELETE: 동의서 초기화 (applied 상태로 되돌림)
export async function DELETE(
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

    // 서명 존재 여부 확인
    const [signature] = await db
      .select({ id: consentSignatures.id })
      .from(consentSignatures)
      .where(eq(consentSignatures.instructorId, id))
      .limit(1);

    if (signature) {
      return NextResponse.json(
        { message: "이미 서명이 완료되어 초기화할 수 없습니다." },
        { status: 400 }
      );
    }

    // consent_settings 삭제
    await db.delete(consentSettings).where(eq(consentSettings.instructorId, id));

    // 상태를 applied로 되돌림
    await db
      .update(instructors)
      .set({ status: "applied" })
      .where(eq(instructors.id, id));

    return NextResponse.json({ success: true, message: "동의서가 초기화되었습니다." });
  } catch (err) {
    console.error("Consent reset error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
