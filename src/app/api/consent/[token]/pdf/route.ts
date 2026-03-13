import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { consentSettings, consentSignatures, instructors } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateConsentPdf } from "@/lib/pdf";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const db = getDb();

    // 토큰으로 동의서 세팅 조회
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

    // 서명 조회
    const [signature] = await db
      .select()
      .from(consentSignatures)
      .where(eq(consentSignatures.consentSettingId, setting.id))
      .limit(1);

    if (!signature) {
      return NextResponse.json(
        { message: "서명이 완료되지 않았습니다." },
        { status: 404 }
      );
    }

    // 강사 정보 조회
    const [instructor] = await db
      .select()
      .from(instructors)
      .where(eq(instructors.id, setting.instructorId))
      .limit(1);

    if (!instructor) {
      return NextResponse.json(
        { message: "강사 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // PDF 생성
    const pdfBytes = await generateConsentPdf({
      instructor: {
        name: instructor.name,
        phone: instructor.phone,
        email: instructor.email,
        bankName: instructor.bankName,
        accountHolder: instructor.accountHolder,
        parkingNeeded: instructor.parkingNeeded,
        carNumber: instructor.carNumber,
      },
      setting: {
        lectureTopic: setting.lectureTopic,
        feeAmount: setting.feeAmount,
        specialTerms: setting.specialTerms,
      },
      signature: {
        topicConfirmed: signature.topicConfirmed,
        feeAgreed: signature.feeAgreed,
        privacyAgreed: signature.privacyAgreed,
        residentIdAgreed: signature.residentIdAgreed,
        portraitAgreed: signature.portraitAgreed,
        signedName: signature.signedName,
        signedAt: signature.signedAt,
      },
      documentId: signature.id,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="consent-${instructor.name}.pdf"`,
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { message: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
