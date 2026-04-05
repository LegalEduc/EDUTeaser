import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { maskResident, maskAccount, decrypt } from "@/lib/encrypt";
import { verifyPassword } from "@/lib/auth";
import {
  instructorSelectWithoutFeeLimitCheck,
  isMissingFeeLimitCheckColumnError,
} from "@/lib/instructor-db-compat";
import { instructorHasProfilePhoto } from "@/lib/instructor-photo";

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

    let instructor: InferSelectModel<typeof instructors> | undefined;
    try {
      const [row] = await db
        .select()
        .from(instructors)
        .where(eq(instructors.id, id))
        .limit(1);
      instructor = row;
    } catch (err) {
      if (!isMissingFeeLimitCheckColumnError(err)) throw err;
      console.warn(
        "instructor detail: fee_limit_check_needed 없음 — 구 컬럼만 조회. scripts/ensure-fee-limit-check-column.sql 실행 권장."
      );
      const [row] = await db
        .select(instructorSelectWithoutFeeLimitCheck)
        .from(instructors)
        .where(eq(instructors.id, id))
        .limit(1);
      instructor = row
        ? ({ ...row, feeLimitCheckNeeded: null } as InferSelectModel<typeof instructors>)
        : undefined;
    }

    if (!instructor) {
      return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
    }

    // 동의서 세팅 조회
    const [consentSetting] = await db
      .select()
      .from(consentSettings)
      .where(eq(consentSettings.instructorId, id))
      .orderBy(desc(consentSettings.createdAt))
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
      try {
        residentNumber = decrypt(instructor.residentNumber);
      } catch {
        residentNumber =
          "(복호화 실패 — 저장 시점 암호화 키와 현재 ENCRYPTION_KEY가 다를 수 있습니다)";
      }
      try {
        accountNumber = decrypt(instructor.accountNumber);
      } catch {
        accountNumber =
          "(복호화 실패 — 저장 시점 암호화 키와 현재 ENCRYPTION_KEY가 다를 수 있습니다)";
      }
    }

    const hasProfilePhoto = await instructorHasProfilePhoto(id);

    return NextResponse.json({
      instructor: {
        ...instructor,
        residentNumber,
        accountNumber,
        sensitiveRevealed: includeSensitive,
        hasProfilePhoto,
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

// PATCH: 강사 상태 변경(거절) · 공문 여부 보정(구버전 미저장 분)
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

    const docPatch: {
      feeDocNeeded?: boolean | null;
      feeLimitCheckNeeded?: boolean | null;
    } = {};
    if ("feeDocNeeded" in body) {
      const v = body.feeDocNeeded;
      if (v !== null && typeof v !== "boolean") {
        return NextResponse.json(
          { message: "feeDocNeeded는 true, false 또는 null만 허용됩니다." },
          { status: 400 }
        );
      }
      docPatch.feeDocNeeded = v;
    }
    if ("feeLimitCheckNeeded" in body) {
      const v = body.feeLimitCheckNeeded;
      if (v !== null && typeof v !== "boolean") {
        return NextResponse.json(
          { message: "feeLimitCheckNeeded는 true, false 또는 null만 허용됩니다." },
          { status: 400 }
        );
      }
      docPatch.feeLimitCheckNeeded = v;
    }

    if (Object.keys(docPatch).length > 0) {
      const [row] = await db
        .select({ id: instructors.id })
        .from(instructors)
        .where(eq(instructors.id, id))
        .limit(1);
      if (!row) {
        return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
      }
      try {
        await db.update(instructors).set(docPatch).where(eq(instructors.id, id));
      } catch (err) {
        if (
          docPatch.feeLimitCheckNeeded !== undefined &&
          isMissingFeeLimitCheckColumnError(err)
        ) {
          const { feeLimitCheckNeeded: _omit, ...withoutFeeLimitCheck } = docPatch;
          if (Object.keys(withoutFeeLimitCheck).length === 0) {
            return NextResponse.json(
              {
                message:
                  "한도 확인 공문 필드는 DB에 컬럼 추가 후 저장할 수 있습니다. scripts/ensure-fee-limit-check-column.sql 참고.",
              },
              { status: 503 }
            );
          }
          console.warn("PATCH: fee_limit_check_needed 없음 — 해당 필드 제외 후 저장");
          await db
            .update(instructors)
            .set(withoutFeeLimitCheck)
            .where(eq(instructors.id, id));
        } else {
          throw err;
        }
      }
      return NextResponse.json({ success: true, message: "공문 여부가 저장되었습니다." });
    }

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

// DELETE: 강사 완전 삭제 (관련 동의서/서명 포함)
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

    const [target] = await db
      .select({ id: instructors.id })
      .from(instructors)
      .where(eq(instructors.id, id))
      .limit(1);

    if (!target) {
      return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
    }

    // FK 제약을 피하기 위해 자식 테이블부터 삭제
    await db.delete(consentSignatures).where(eq(consentSignatures.instructorId, id));
    await db.delete(consentSettings).where(eq(consentSettings.instructorId, id));
    await db.delete(instructors).where(eq(instructors.id, id));

    return NextResponse.json({ success: true, message: "강사 정보가 삭제되었습니다." });
  } catch (err) {
    console.error("Instructor delete error:", err);
    return NextResponse.json(
      { message: "강사 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
