import { getStore } from "@netlify/blobs";

/** `/api/instructors/[id]/photo` 업로드·조회와 동일한 확장자·키 규칙 */
export const INSTRUCTOR_PHOTO_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
] as const;

/**
 * Netlify Blobs `instructor-photos` 스토어에 해당 강사 ID의 이미지가 있는지 확인합니다.
 * 로컬·Blobs 미설정 시 false 를 반환합니다.
 */
export async function instructorHasProfilePhoto(
  instructorId: string
): Promise<boolean> {
  try {
    const store = getStore("instructor-photos");
    for (const ext of INSTRUCTOR_PHOTO_EXTENSIONS) {
      const key = `${instructorId}${ext}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await (store as any).get(key, { type: "arrayBuffer" });
      if (blob) return true;
    }
    return false;
  } catch (err) {
    console.warn("instructorHasProfilePhoto:", instructorId, err);
    return false;
  }
}
