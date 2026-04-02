import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("SMTP_USER or SMTP_PASS is not set");

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

const EMAIL_FROM =
  process.env.EMAIL_FROM || "LegalCrew Academy <cs@legalcrew.co.kr>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@legalcrew.co.kr";

export async function sendApplyNotification(instructor: {
  name: string;
  email: string;
}) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: EMAIL_FROM,
    to: ADMIN_EMAIL,
    subject: `[마스터 사전 정보 등록] ${instructor.name}님이 정보를 등록했습니다`,
    html: `
      <h2>새로운 마스터 사전 정보 등록</h2>
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
  const transporter = getTransporter();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:3000";
  const link = `${baseUrl}/consent/${token}`;

  await transporter.sendMail({
    from: EMAIL_FROM,
    to,
    subject: "[리걸크루 아카데미] 강의 동의서 확인 요청",
    html: `
      <h2>${name}님, 안녕하세요.</h2>
      <p>리걸크루 변호사 실전 압축 부트캠프의 강의 조건을 확인하고 동의서에 서명해 주세요.</p>
      <p style="margin: 24px 0;">
        <a href="${link}" style="display:inline-block;padding:12px 24px;background:#1b61c9;color:#ffffff;text-decoration:none;font-weight:bold;border-radius:12px;">
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
  const transporter = getTransporter();
  await transporter.sendMail({
    from: EMAIL_FROM,
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

  const transporter = getTransporter();
  let sentCount = 0;

  for (const email of to) {
    try {
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: `[리걸크루 아카데미] ${title}`,
        html: `
          <h2>${title}</h2>
          <div style="white-space:pre-wrap;line-height:1.8;">${body}</div>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee;">
          <p style="color:#999;font-size:12px;">LegalCrew Academy | cs@legalcrew.co.kr</p>
        `,
      });
      sentCount++;
    } catch (err) {
      console.error(`Email send error (${email}):`, err);
    }
  }

  return sentCount;
}
