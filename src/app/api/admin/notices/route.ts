import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { notices, instructors } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { sendNotice } from "@/lib/email";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const db = getDb();
    const result = await db
      .select()
      .from(notices)
      .orderBy(desc(notices.createdAt));

    return NextResponse.json({ notices: result });
  } catch (err) {
    console.error("Notices list error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const db = getDb();
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ message: "제목을 입력해 주세요." }, { status: 400 });
    }
    if (!body.body?.trim()) {
      return NextResponse.json({ message: "내용을 입력해 주세요." }, { status: 400 });
    }
    if (!["all", "consented_only"].includes(body.target)) {
      return NextResponse.json({ message: "대상을 선택해 주세요." }, { status: 400 });
    }

    // 대상 강사 이메일 조회
    let targetQuery = db
      .select({ email: instructors.email })
      .from(instructors)
      .$dynamic();

    if (body.target === "consented_only") {
      targetQuery = targetQuery.where(eq(instructors.status, "consented"));
    }

    const targets = await targetQuery;
    const emails = targets.map((t) => t.email);

    // DB 저장
    const [inserted] = await db
      .insert(notices)
      .values({
        title: body.title.trim(),
        body: body.body.trim(),
        target: body.target,
        sentCount: 0,
      })
      .returning({ id: notices.id });

    // 이메일 발송 (비동기, 발송 수 업데이트)
    sendNotice(emails, body.title.trim(), body.body.trim())
      .then(async (sentCount) => {
        await db
          .update(notices)
          .set({ sentCount })
          .where(eq(notices.id, inserted.id));
      })
      .catch((err) => console.error("Notice email error:", err));

    return NextResponse.json(
      { success: true, sentCount: emails.length },
      { status: 201 }
    );
  } catch (err) {
    console.error("Notice create error:", err);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
