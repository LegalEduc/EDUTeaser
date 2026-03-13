import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  const response = NextResponse.next();

  // 1. MIME 타입 스니핑 방지
  response.headers.set("X-Content-Type-Options", "nosniff");

  // 2. 클릭재킹 방지 (iframe 삽입 차단)
  response.headers.set("X-Frame-Options", "DENY");

  // 3. 브라우저 내장 XSS 필터
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // 4. 리퍼러 정보 최소 노출
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // 5. 불필요한 브라우저 API 차단
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 6. HTTPS 강제 (1년)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // 7. CSP — XSS 공격 방어, 리소스 로딩 제한
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    // 정적 파일(_next/static, favicon 등)은 제외
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
