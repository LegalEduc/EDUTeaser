import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@netlify/blobs";
import { getDb } from "@/lib/db";
import { instructors } from "@/lib/schema";
import { eq } from "drizzle-orm";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function getPhotoStore() {
  return getStore("instructor-photos");
}

function getExtension(name: string): string {
  const lower = name.toLowerCase();
  const idx = lower.lastIndexOf(".");
  return idx === -1 ? "" : lower.slice(idx);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDb();

    const [exists] = await db
      .select({ id: instructors.id })
      .from(instructors)
      .where(eq(instructors.id, id))
      .limit(1);

    if (!exists) {
      return NextResponse.json({ message: "강사를 찾을 수 없습니다." }, { status: 404 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "파일을 업로드해 주세요." }, { status: 400 });
    }

    const ext = getExtension(file.name || "");
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { message: "이미지 파일(jpg, jpeg, png, webp)만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "이미지 파일은 20MB 이하만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    const key = `${id}${ext}`;
    const store = getPhotoStore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (store as any).set(key, file);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Instructor photo upload error:", err);
    return NextResponse.json(
      { message: "사진 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    for (const ext of ALLOWED_EXTENSIONS) {
      const key = `${id}${ext}`;
      const store = getPhotoStore();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await (store as any).get(key, { type: "arrayBuffer" });
      if (blob) {
        const buffer = Buffer.from(blob);
        const contentType =
          ext === ".png"
            ? "image/png"
            : ext === ".webp"
              ? "image/webp"
              : "image/jpeg";
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            "Content-Type": contentType,
          },
        });
      }
    }

    return NextResponse.json({ message: "사진이 업로드되지 않았습니다." }, { status: 404 });
  } catch (err) {
    console.error("Instructor photo get error:", err);
    return NextResponse.json(
      { message: "사진 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

