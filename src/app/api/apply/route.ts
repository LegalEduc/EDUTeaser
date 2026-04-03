import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors } from "@/lib/schema";
import { encrypt } from "@/lib/encrypt";
import { sendApplyNotification } from "@/lib/email";
import { eq } from "drizzle-orm";

// IP 기반 Rate Limiting (인메모리, 서버리스 인스턴스 단위)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1분
const RATE_LIMIT_MAX = 10; // 1분에 최대 10회
const ipRequests = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipRequests.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequests.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

interface ApplyBody {
  programName: string;
  name: string;
  residentNumber: string;
  barExamType: "judicial_exam" | "bar_exam";
  barExamDetail: string;
  bio: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  parkingNeeded: boolean;
  carNumber?: string;
  feeLimit?: string;
  feeDocNeeded?: boolean;
  privacyAgreed: boolean;
  residentIdAgreed: boolean;
}

function validateBody(body: ApplyBody): string | null {
  if (!body.name?.trim()) return "이름을 입력해 주세요.";
  if (!body.residentNumber?.match(/^\d{6}-\d{7}$/))
    return "주민등록번호 형식이 올바르지 않습니다. (000000-0000000)";
  if (!["judicial_exam", "bar_exam"].includes(body.barExamType))
    return "자격시험 구분을 선택해 주세요.";
  if (!body.barExamDetail?.trim()) return "자격시험 상세를 입력해 주세요.";
  if (!body.bio?.trim()) return "이력 사항을 입력해 주세요.";
  if (!body.phone?.match(/^01[016789]-?\d{3,4}-?\d{4}$/))
    return "휴대폰 번호 형식이 올바르지 않습니다.";
  if (!body.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    return "이메일 형식이 올바르지 않습니다.";
  if (!body.bankName?.trim()) return "은행명을 선택해 주세요.";
  if (!body.accountNumber?.trim()) return "계좌번호를 입력해 주세요.";
  if (!body.accountHolder?.trim()) return "예금주를 입력해 주세요.";
  if (body.parkingNeeded && !body.carNumber?.trim())
    return "주차가 필요한 경우 차량번호를 입력해 주세요.";
  if (!body.privacyAgreed) return "개인정보 수집·이용에 동의해 주세요.";
  if (!body.residentIdAgreed)
    return "홍보 및 자료제공 활용에 동의해 주세요.";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Rate Limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const body: ApplyBody = await request.json();

    // 유효성 검증
    const error = validateBody(body);
    if (error) {
      return NextResponse.json({ success: false, message: error }, { status: 400 });
    }

    const db = getDb();

    // 이메일 중복 체크
    const existing = await db
      .select({ id: instructors.id })
      .from(instructors)
      .where(eq(instructors.email, body.email.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "이미 신청된 이메일입니다." },
        { status: 409 }
      );
    }

    // 민감정보 암호화
    const encryptedResident = encrypt(body.residentNumber);
    const encryptedAccount = encrypt(body.accountNumber);

    // DB 저장
    const [inserted] = await db.insert(instructors).values({
      programName: body.programName?.trim() || "리걸크루 변호사 실전 압축 부트캠프 1기",
      name: body.name.trim(),
      residentNumber: encryptedResident,
      barExamType: body.barExamType,
      barExamDetail: body.barExamDetail.trim(),
      bio: body.bio.trim(),
      phone: body.phone.trim().replace(/-/g, ""),
      email: body.email.trim().toLowerCase(),
      bankName: body.bankName.trim(),
      accountNumber: encryptedAccount,
      accountHolder: body.accountHolder.trim(),
      parkingNeeded: body.parkingNeeded,
      carNumber: body.parkingNeeded ? body.carNumber?.trim() : null,
      feeLimit: body.feeLimit?.trim() || null,
      feeDocNeeded: body.feeDocNeeded ?? null,
    }).returning({ id: instructors.id });

    // 어드민에게 신규 신청 알림 (비동기, 실패해도 신청은 성공)
    sendApplyNotification({
      name: body.name.trim(),
      email: body.email.trim(),
    }).catch((err) => console.error("Apply notification email error:", err));

    return NextResponse.json(
      { success: true, id: inserted.id, message: "신청이 접수되었습니다." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Apply API error:", err);
    const isEncryptionKeyIssue =
      err instanceof Error && err.message.includes("ENCRYPTION_KEY");
    const message = isEncryptionKeyIssue
      ? "서버 보안 키 설정이 누락되었습니다. 관리자에게 문의해 주세요."
      : "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
