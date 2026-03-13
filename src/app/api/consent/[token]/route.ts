import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { consentSettings, consentSignatures, instructors } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { sendConsentComplete } from "@/lib/email";

// GET: 동의서 데이터 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getDb();

    const [setting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.token, token))
      .limit(1);

    if (!setting) {
      return NextResponse.json(
        { message: "유효하지 않은 링크입니다." },
        { status: 404 }
      );
    }

    const [instructor] = await db
      .select({ name: instructors.name })
      .from(instructors)
      .where(eq(instructors.id, setting.instructorId))
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { message: "강사 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 서명 완료 여부
    const [existingSig] = await db
      .select({ id: consentSignatures.id })
      .from(consentSignatures)
      .where(eq(consentSignatures.consentSettingId, setting.id))
      .limit(1);

    return NextResponse.json({
      instructor: { name: instructor.name },
      setting: {
        lectureTopic: setting.lectureTopic,
        feeAmount: setting.feeAmount,
        specialTerms: setting.specialTerms,
      },
      alreadySigned: !!existingSig,
    });
  } catch (err) {
    console.error("Consent GET error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 서명 제출
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getDb();
    const body = await request.json();

    // 토큰 유효성 확인
    const [setting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.token, token))
      .limit(1);

    if (!setting) {
      return NextResponse.json(
        { message: "유효하지 않은 링크입니다." },
        { status: 404 }
      );
    }

    // 이미 서명 완료 확인
    const [existingSig] = await db
      .select({ id: consentSignatures.id })
      .from(consentSignatures)
      .where(eq(consentSignatures.consentSettingId, setting.id))
      .limit(1);

    if (existingSig) {
      return NextResponse.json(
        { message: "이미 서명이 완료되었습니다." },
        { status: 409 }
      );
    }

    // 필수 동의 체크
    if (!body.topicConfirmed || !body.feeAgreed || !body.privacyAgreed || !body.residentIdAgreed) {
      return NextResponse.json(
        { message: "필수 동의 항목을 모두 체크해 주세요." },
        { status: 400 }
      );
    }

    if (!body.signedName?.trim()) {
      return NextResponse.json(
        { message: "서명 이름을 입력해 주세요." },
        { status: 400 }
      );
    }

    // 이름 일치 검증
    const [instructor] = await db
      .select({ name: instructors.name })
      .from(instructors)
      .where(eq(instructors.id, setting.instructorId))
      .limit(1);

    if (body.signedName.trim() !== instructor?.name) {
      return NextResponse.json(
        { message: "서명 이름이 신청 시 이름과 일치하지 않습니다." },
        { status: 400 }
      );
    }

    // IP 주소
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    // 서명 저장
    await db.insert(consentSignatures).values({
      instructorId: setting.instructorId,
      consentSettingId: setting.id,
      topicConfirmed: body.topicConfirmed,
      feeAgreed: body.feeAgreed,
      privacyAgreed: body.privacyAgreed,
      residentIdAgreed: body.residentIdAgreed,
      portraitAgreed: body.portraitAgreed || false,
      signedName: body.signedName.trim(),
      ipAddress: ip,
    });

    // 강사 상태 업데이트
    await db
      .update(instructors)
      .set({ status: "consented" })
      .where(eq(instructors.id, setting.instructorId));

    // 어드민에게 서명 완료 알림 (비동기)
    sendConsentComplete({ name: body.signedName.trim() }).catch(
      (err) => console.error("Consent complete email error:", err)
    );

    return NextResponse.json(
      { success: true, pdfUrl: `/api/consent/${token}/pdf` },
      { status: 201 }
    );
  } catch (err) {
    console.error("Consent POST error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
