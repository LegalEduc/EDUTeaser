import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  return new Resend(key);
}

function getFrom() {
  return process.env.EMAIL_FROM || "LegalCrew Academy <noreply@legalcrew.co.kr>";
}

const ADMIN_EMAIL = "cs@legalcrew.co.kr";

export async function sendApplyNotification(instructor: {
  name: string;
  email: string;
}) {
  const resend = getResend();
  await resend.emails.send({
    from: getFrom(),
    to: ADMIN_EMAIL,
    subject: `[멘토 신청] ${instructor.name}님이 참여를 신청했습니다`,
    html: `
      <h2>새로운 멘토 참여 신청</h2>
      <p><strong>이름:</strong> ${instructor.name}</p>
      <p><strong>이메일:</strong> ${instructor.email}</p>
      <p>어드민 페이지에서 상세 내용을 확인하세요.</p>
    `,
  });
}

export async function sendConsentLink(
  to: string,
  name: string,
  token: string
) {
  const resend = getResend();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
  const link = `${baseUrl}/consent/${token}`;

  await resend.emails.send({
    from: getFrom(),
    to,
    subject: "[리걸크루 아카데미] 강의 동의서 확인 요청",
    html: `
      <h2>${name}님, 안녕하세요.</h2>
      <p>리걸크루 변호사 실전 압축 부트캠프(The Rookie Camp)의 강의 조건을 확인하고 동의서에 서명해 주세요.</p>
      <p style="margin: 24px 0;">
        <a href="${link}" style="display:inline-block;padding:12px 32px;background:#c4993c;color:#0f0f1e;text-decoration:none;font-weight:bold;border-radius:50px;">
          동의서 확인하기
        </a>
      </p>
      <p style="color:#666;font-size:13px;">위 버튼이 작동하지 않으면 아래 링크를 브라우저에 복사해 주세요:<br>${link}</p>
      <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
      <p style="color:#999;font-size:12px;">LegalCrew Academy | cs@legalcrew.co.kr</p>
    `,
  });
}

export async function sendConsentComplete(instructor: { name: string }) {
  const resend = getResend();
  await resend.emails.send({
    from: getFrom(),
    to: ADMIN_EMAIL,
    subject: `[서명 완료] ${instructor.name}님이 동의서에 서명했습니다`,
    html: `
      <h2>동의서 서명 완료</h2>
      <p><strong>${instructor.name}</strong>님이 강의 동의서에 서명을 완료했습니다.</p>
      <p>어드민 페이지에서 PDF를 다운로드하실 수 있습니다.</p>
    `,
  });
}

export async function sendNotice(
  to: string[],
  title: string,
  body: string
): Promise<number> {
  if (to.length === 0) return 0;

  const resend = getResend();
  let sentCount = 0;

  // 배치 발송 (최대 100건씩)
  const batchSize = 100;
  for (let i = 0; i < to.length; i += batchSize) {
    const batch = to.slice(i, i + batchSize);
    try {
      await resend.batch.send(
        batch.map((email) => ({
          from: getFrom(),
          to: email,
          subject: `[리걸크루 아카데미] ${title}`,
          html: `
            <h2>${title}</h2>
            <div style="white-space:pre-wrap;line-height:1.8;">${body}</div>
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
            <p style="color:#999;font-size:12px;">LegalCrew Academy | cs@legalcrew.co.kr</p>
          `,
        }))
      );
      sentCount += batch.length;
    } catch (err) {
      console.error("Email batch error:", err);
    }
  }

  return sentCount;
}
