import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { getTokenFromRequest, verifyToken, verifyPassword } from "@/lib/auth";
import { decrypt } from "@/lib/encrypt";
import {
  instructorsExportJoinSelectFull,
  instructorsExportJoinSelectLegacy,
  isMissingFeeLimitCheckColumnError,
} from "@/lib/instructor-db-compat";

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

function mapBarExamType(value: string | null): string {
  if (!value) return "";
  if (value === "judicial_exam") return "연수원";
  if (value === "bar_exam") return "변시";
  return value;
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
    let rows: Array<{
      feeLimitCheckNeeded: boolean | null;
      id: string;
      name: string;
      email: string;
      phone: string;
      residentNumberEnc: string;
      barExamType: string;
      barExamDetail: string;
      bio: string;
      bankName: string;
      accountNumberEnc: string;
      accountHolder: string;
      parkingNeeded: boolean;
      carNumber: string | null;
      feeLimit: string | null;
      feeDocNeeded: boolean | null;
      status: string;
      appliedAt: Date | null;
      lectureTopic: string | null;
      lectureCount: number | null;
      feeAmount: number | null;
      totalFee: number | null;
      specialTerms: string | null;
      sentAt: Date | null;
      signedName: string | null;
      signedAt: Date | null;
    }>;
    try {
      rows = await db
        .select(instructorsExportJoinSelectFull)
        .from(instructors)
        .leftJoin(consentSettings, eq(consentSettings.instructorId, instructors.id))
        .leftJoin(consentSignatures, eq(consentSignatures.instructorId, instructors.id))
        .orderBy(desc(instructors.appliedAt));
    } catch (err) {
      if (!isMissingFeeLimitCheckColumnError(err)) throw err;
      console.warn("export: fee_limit_check_needed 없음 — 구 컬럼만 조회");
      const legacy = await db
        .select(instructorsExportJoinSelectLegacy)
        .from(instructors)
        .leftJoin(consentSettings, eq(consentSettings.instructorId, instructors.id))
        .leftJoin(consentSignatures, eq(consentSignatures.instructorId, instructors.id))
        .orderBy(desc(instructors.appliedAt));
      rows = legacy.map((r) => ({ ...r, feeLimitCheckNeeded: null }));
    }

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
      "출강요청공문필요",
      "한도확인공문필요",
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
          mapBarExamType(row.barExamType),
          row.barExamDetail,
          row.bio,
          row.bankName,
          accountNumber,
          row.accountHolder,
          row.parkingNeeded ? "Y" : "N",
          row.carNumber || "",
          row.feeLimit || "",
          row.feeDocNeeded === null ? "" : row.feeDocNeeded ? "Y" : "N",
          row.feeLimitCheckNeeded === null
            ? ""
            : row.feeLimitCheckNeeded
              ? "Y"
              : "N",
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

