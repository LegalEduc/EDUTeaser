import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getTokenFromRequest, verifyToken, verifyPassword } from "@/lib/auth";
import { decrypt } from "@/lib/encrypt";

function toCsvValue(v: unknown): string {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

function safeDecrypt(value: string): string {
  try {
    return decrypt(value);
  } catch {
    return "";
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !(await verifyToken(token))) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
    }

    const adminPassword = request.headers.get("x-admin-password");
    if (!adminPassword) {
      return NextResponse.json(
        { message: "엑셀 다운로드를 위해 2차 인증 비밀번호를 입력해 주세요." },
        { status: 400 }
      );
    }

    const valid = await verifyPassword(adminPassword);
    if (!valid) {
      return NextResponse.json(
        { message: "2차 인증 비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const db = getDb();
    const rows = await db
      .select({
        id: instructors.id,
        name: instructors.name,
        email: instructors.email,
        phone: instructors.phone,
        residentNumberEnc: instructors.residentNumber,
        barExamType: instructors.barExamType,
        barExamDetail: instructors.barExamDetail,
        bio: instructors.bio,
        bankName: instructors.bankName,
        accountNumberEnc: instructors.accountNumber,
        accountHolder: instructors.accountHolder,
        parkingNeeded: instructors.parkingNeeded,
        carNumber: instructors.carNumber,
        feeLimit: instructors.feeLimit,
        feeDocNeeded: instructors.feeDocNeeded,
        status: instructors.status,
        appliedAt: instructors.appliedAt,
        lectureTopic: consentSettings.lectureTopic,
        lectureCount: consentSettings.lectureCount,
        feeAmount: consentSettings.feeAmount,
        totalFee: consentSettings.totalFee,
        specialTerms: consentSettings.specialTerms,
        sentAt: consentSettings.sentAt,
        signedName: consentSignatures.signedName,
        signedAt: consentSignatures.signedAt,
      })
      .from(instructors)
      .leftJoin(consentSettings, eq(consentSettings.instructorId, instructors.id))
      .leftJoin(consentSignatures, eq(consentSignatures.instructorId, instructors.id))
      .orderBy(desc(instructors.appliedAt));

    const header = [
      "ID",
      "이름",
      "이메일",
      "휴대전화번호",
      "주민등록번호",
      "자격시험구분",
      "자격시험상세",
      "이력사항",
      "은행명",
      "계좌번호",
      "예금주",
      "주차필요",
      "차량번호",
      "강사료한도",
      "강사료내역공문필요",
      "상태",
      "신청일",
      "강의주제",
      "총강의횟수",
      "강사료(회당)",
      "총강사료",
      "특약사항",
      "동의서발송일",
      "서명인",
      "서명일",
    ];

    const lines = [header.map(toCsvValue).join(",")];
    for (const row of rows) {
      const residentNumber = safeDecrypt(row.residentNumberEnc);
      const accountNumber = safeDecrypt(row.accountNumberEnc);
      lines.push(
        [
          row.id,
          row.name,
          row.email,
          row.phone,
          residentNumber,
          row.barExamType,
          row.barExamDetail,
          row.bio,
          row.bankName,
          accountNumber,
          row.accountHolder,
          row.parkingNeeded ? "Y" : "N",
          row.carNumber || "",
          row.feeLimit || "",
          row.feeDocNeeded === null ? "" : row.feeDocNeeded ? "Y" : "N",
          row.status,
          row.appliedAt ? new Date(row.appliedAt).toISOString() : "",
          row.lectureTopic || "",
          row.lectureCount ?? "",
          row.feeAmount ?? "",
          row.totalFee ?? "",
          row.specialTerms || "",
          row.sentAt ? new Date(row.sentAt).toISOString() : "",
          row.signedName || "",
          row.signedAt ? new Date(row.signedAt).toISOString() : "",
        ]
          .map(toCsvValue)
          .join(",")
      );
    }

    const csv = `\uFEFF${lines.join("\n")}`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="instructors-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Instructors export error:", err);
    const message =
      err instanceof Error && err.message.includes("ENCRYPTION_KEY")
        ? "서버 보안 키 설정(ENCRYPTION_KEY)이 누락되어 엑셀 다운로드를 진행할 수 없습니다."
        : "엑셀 다운로드 중 오류가 발생했습니다.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}

