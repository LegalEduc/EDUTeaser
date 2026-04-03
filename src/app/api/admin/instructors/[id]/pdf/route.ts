import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { consentSettings, consentSignatures, instructors } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { generateConsentPdf } from "@/lib/pdf";

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
      return NextResponse.json(
        { message: "강사를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const [setting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.instructorId, id))
      .orderBy(desc(consentSettings.createdAt))
      .limit(1);

    if (!setting) {
      return NextResponse.json(
        { message: "동의서 세팅이 없습니다." },
        { status: 404 }
      );
    }

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
        "Content-Disposition": `attachment; filename="consent.pdf"; filename*=UTF-8''${encodeURIComponent(`consent-${instructor.name}.pdf`)}`,
      },
    });
  } catch (err) {
    console.error("Admin PDF error:", err);
    return NextResponse.json(
      { message: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
