import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { maskResident, maskAccount, decrypt } from "@/lib/encrypt";
import { verifyPassword } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeSensitive = searchParams.get("includeSensitive") === "1";
    const adminPassword = request.headers.get("x-admin-password");

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

    let residentNumber = maskResident(instructor.residentNumber);
    let accountNumber = maskAccount(instructor.accountNumber);

    if (includeSensitive) {
      if (!adminPassword) {
        return NextResponse.json(
          { message: "2차 인증 비밀번호를 입력해 주세요." },
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
      residentNumber = decrypt(instructor.residentNumber);
      accountNumber = decrypt(instructor.accountNumber);
    }

    return NextResponse.json({
      instructor: {
        ...instructor,
        residentNumber,
        accountNumber,
        sensitiveRevealed: includeSensitive,
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

// PATCH: 강사 상태 변경 (거절 등)
export async function PATCH(
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

    if (body.status === "rejected") {
      const [instructor] = await db
        .select({ id: instructors.id, status: instructors.status })
        .from(instructors)
        .where(eq(instructors.id, id))
        .limit(1);

      if (!instructor) {
        return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
      }

      if (instructor.status !== "applied") {
        return NextResponse.json(
          { message: "신청 상태의 강사만 거절할 수 있습니다." },
          { status: 400 }
        );
      }

      await db
        .update(instructors)
        .set({ status: "rejected" })
        .where(eq(instructors.id, id));

      return NextResponse.json({ success: true, message: "거절 처리되었습니다." });
    }

    return NextResponse.json({ message: "유효하지 않은 요청입니다." }, { status: 400 });
  } catch (err) {
    console.error("Instructor update error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
