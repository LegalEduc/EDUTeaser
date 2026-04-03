import { PDFDocument, rgb } from "pdf-lib";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fontkit = require("fontkit");
import { readFile } from "fs/promises";
import { join } from "path";

interface PdfData {
  instructor: {
    name: string;
    phone: string;
    email: string;
    bankName: string;
    accountHolder: string;
    parkingNeeded: boolean;
    carNumber: string | null;
  };
  setting: {
    lectureTopic: string;
    feeAmount: number;
    totalFee: number;
    specialTerms: string | null;
  };
  signature: {
    topicConfirmed: boolean;
    feeAgreed: boolean;
    privacyAgreed: boolean;
    residentIdAgreed: boolean;
    portraitAgreed: boolean;
    signedName: string;
    signedAt: Date;
  };
  documentId: string;
}


function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

export async function generateConsentPdf(data: PdfData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // 한글 폰트 로드
  const fontPath = join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf");
  const fontBytes = await readFile(fontPath);
  const font = await pdfDoc.embedFont(fontBytes, { subset: true });

  const page = pdfDoc.addPage([595, 842]); // A4
  const { height } = page.getSize();
  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const accent = rgb(0, 0, 0);

  let y = height - 60;
  const leftMargin = 50;
  const contentWidth = 495;

  // 헤더
  page.drawText("리걸크루 변호사 실전 압축 부트캠프", {
    x: leftMargin,
    y,
    size: 12,
    font,
    color: gray,
  });

  y -= 30;
  page.drawText("강의 동의서", {
    x: leftMargin,
    y,
    size: 22,
    font,
    color: black,
  });

  // 구분선
  y -= 20;
  page.drawLine({
    start: { x: leftMargin, y },
    end: { x: leftMargin + contentWidth, y },
    thickness: 1,
    color: accent,
  });

  // 강사 정보
  y -= 35;
  page.drawText("강사 정보", {
    x: leftMargin,
    y,
    size: 13,
    font,
    color: accent,
  });

  const infoItems = [
    ["성명", data.instructor.name],
    ["연락처", formatPhoneDisplay(data.instructor.phone)],
    ["이메일", data.instructor.email],
    ["은행", `${data.instructor.bankName} (${data.instructor.accountHolder})`],
    [
      "주차",
      data.instructor.parkingNeeded
        ? `필요 (${data.instructor.carNumber || "-"})`
        : "불필요",
    ],
  ];

  y -= 25;
  for (const [label, value] of infoItems) {
    page.drawText(`${label}:`, {
      x: leftMargin + 10,
      y,
      size: 12,
      font,
      color: gray,
    });
    page.drawText(value, {
      x: leftMargin + 80,
      y,
      size: 12,
      font,
      color: black,
    });
    y -= 18;
  }

  // 강의 조건
  y -= 15;
  page.drawText("강의 조건", {
    x: leftMargin,
    y,
    size: 13,
    font,
    color: accent,
  });

  y -= 25;
  page.drawText("강의 주제:", {
    x: leftMargin + 10,
    y,
    size: 12,
    font,
    color: gray,
  });
  page.drawText(data.setting.lectureTopic, {
    x: leftMargin + 80,
    y,
    size: 12,
    font,
    color: black,
  });

  y -= 18;
  page.drawText("총 강사료:", {
    x: leftMargin + 10,
    y,
    size: 12,
    font,
    color: gray,
  });
  page.drawText(`${data.setting.totalFee.toLocaleString()}원`, {
    x: leftMargin + 80,
    y,
    size: 12,
    font,
    color: black,
  });

  if (data.setting.specialTerms) {
    y -= 18;
    page.drawText("특약사항:", {
      x: leftMargin + 10,
      y,
      size: 12,
      font,
      color: gray,
    });
    page.drawText(data.setting.specialTerms, {
      x: leftMargin + 80,
      y,
      size: 12,
      font,
      color: black,
    });
  }

  // 동의 항목
  y -= 30;
  page.drawText("동의 항목", {
    x: leftMargin,
    y,
    size: 13,
    font,
    color: accent,
  });

  const checkItems = [
    [data.signature.topicConfirmed, "강의 주제 및 일정 확인", true],
    [data.signature.feeAgreed, "강사료 조건 동의", true],
    [data.signature.privacyAgreed, "개인정보 수집·이용 동의", true],
    [data.signature.residentIdAgreed, "고유식별정보 수집·이용 동의", true],
    [data.signature.portraitAgreed, "초상권 활용 동의", false],
  ] as const;

  y -= 25;
  for (const [checked, label, required] of checkItems) {
    const mark = checked ? "[v]" : "[ ]";
    const suffix = required ? " (필수)" : " (선택)";
    page.drawText(`${mark} ${label}${suffix}`, {
      x: leftMargin + 10,
      y,
      size: 12,
      font,
      color: checked ? black : gray,
    });
    y -= 18;
  }

  // 서명
  y -= 20;
  page.drawLine({
    start: { x: leftMargin, y },
    end: { x: leftMargin + contentWidth, y },
    thickness: 0.5,
    color: gray,
  });

  y -= 30;
  page.drawText("서명", {
    x: leftMargin,
    y,
    size: 13,
    font,
    color: accent,
  });

  y -= 25;
  page.drawText(`서명인: ${data.signature.signedName}`, {
    x: leftMargin + 10,
    y,
    size: 12,
    font,
    color: black,
  });

  y -= 18;
  const signedDate = data.signature.signedAt.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  });
  page.drawText(`서명일시: ${signedDate}`, {
    x: leftMargin + 10,
    y,
    size: 12,
    font,
    color: gray,
  });

  // 하단 문서번호
  y = 40;
  page.drawLine({
    start: { x: leftMargin, y: y + 10 },
    end: { x: leftMargin + contentWidth, y: y + 10 },
    thickness: 0.5,
    color: gray,
  });
  page.drawText(`문서번호: ${data.documentId}`, {
    x: leftMargin,
    y: y - 5,
    size: 12,
    font,
    color: gray,
  });

  const genDate = new Date().toLocaleDateString("ko-KR");
  page.drawText(`생성일: ${genDate}`, {
    x: leftMargin + contentWidth - 100,
    y: y - 5,
    size: 12,
    font,
    color: gray,
  });

  return pdfDoc.save();
}
