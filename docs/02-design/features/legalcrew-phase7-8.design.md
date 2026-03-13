# LegalCrew Phase 7~8 Design Document

> **Summary**: SEO 최적화 + 보안 헤더 + HTML sanitize + 코드 리뷰 상세 설계
>
> **Project**: LegalCrew Academy (강사섭외 시스템)
> **Version**: 1.1
> **Author**: Claude Code
> **Date**: 2026-03-13
> **Status**: Draft
> **Planning Doc**: [legalcrew-phase7-8.plan.md](../01-plan/features/legalcrew-phase7-8.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 프로덕션 배포 전 SEO/보안 품질 확보
- 외부 라이브러리 최소화 (Next.js 내장 기능 활용)
- 기존 코드 변경 최소화 (5개 파일 이내 원칙)

### 1.2 Design Principles

- Next.js App Router 표준 방식 준수 (`robots.ts`, `sitemap.ts`)
- Middleware로 보안 헤더 일괄 적용 (개별 API 수정 불필요)
- 서버사이드 sanitize (클라이언트 우회 방지)

---

## 2. Architecture

### 2.1 Phase 7 변경 구조

```
Request
  │
  ▼
┌─────────────────────┐
│  src/middleware.ts   │  ← 신규: 보안 헤더 주입
│  (Security Headers) │
└────────┬────────────┘
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌──────────────┐                  ┌───────────────┐
│ 공개 페이지  │                  │ API Routes    │
│ / (티저)     │                  │ /api/*        │
│ /robots.txt  │ ← 신규          │               │
│ /sitemap.xml │ ← 신규          │ notices POST  │ ← sanitize 추가
└──────────────┘                  └───────────────┘
```

### 2.2 변경/신규 파일 목록

| # | 파일 | 상태 | 역할 |
|---|------|:----:|------|
| 1 | `src/app/robots.ts` | 신규 | robots.txt 생성 |
| 2 | `src/app/sitemap.ts` | 신규 | sitemap.xml 생성 |
| 3 | `src/app/layout.tsx` | 수정 | 메타데이터 보강 (OG image, Twitter, canonical) |
| 4 | `src/middleware.ts` | 신규 | 보안 헤더 7종 |
| 5 | `src/app/api/admin/notices/route.ts` | 수정 | body HTML sanitize |

---

## 3. 상세 설계

### 3.1 robots.ts (FR-01)

**경로**: `src/app/robots.ts`

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/consent", "/consent/*", "/api/*"],
      },
    ],
    sitemap: "https://academy.legalcrew.co.kr/sitemap.xml",
  };
}
```

**설계 포인트**:
- 공개 페이지(`/`)만 Allow
- 어드민(`/admin/*`), 동의서(`/consent/*`), API(`/api/*`) 모두 Disallow
- sitemap URL은 `NEXT_PUBLIC_BASE_URL` 기반으로 동적 생성

---

### 3.2 sitemap.ts (FR-02)

**경로**: `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://academy.legalcrew.co.kr";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
```

**설계 포인트**:
- 공개 페이지는 `/` 하나뿐 (멘토 모집 티저)
- `changeFrequency: "weekly"` — 프로그램 정보 업데이트 주기 반영

---

### 3.3 layout.tsx 메타데이터 보강 (FR-03, FR-04, FR-05)

**경로**: `src/app/layout.tsx` (수정)

**변경 내용**: `metadata` 객체 보강

```typescript
export const metadata: Metadata = {
  title: "리걸크루 변호사 실전 압축 부트캠프 — The Rookie Camp",
  description: "법조계의 새로운 실무 표준을 정립할 리걸 커리어 멘토를 모십니다. 12주간의 실전 압축 부트캠프.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://academy.legalcrew.co.kr"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LegalCrew Academy — The Rookie Camp",
    description: "법조계의 새로운 실무 표준을 정립할 멘토를 모십니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "LegalCrew Academy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LegalCrew Academy — The Rookie Camp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LegalCrew Academy — The Rookie Camp",
    description: "법조계의 새로운 실무 표준을 정립할 멘토를 모십니다.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**설계 포인트**:
- `metadataBase`로 canonical/OG 이미지 절대 URL 자동 생성
- OG 이미지: `public/og-image.png` (1200x630) — 별도 제작 필요 (Out of Scope이면 플레이스홀더 사용)
- Twitter Card: `summary_large_image` (큰 이미지 미리보기)

---

### 3.4 middleware.ts — 보안 헤더 (FR-06)

**경로**: `src/middleware.ts` (신규)

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 보안 헤더 7종
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
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
```

**설계 포인트**:

| 헤더 | 값 | 목적 |
|------|-----|------|
| `X-Content-Type-Options` | `nosniff` | MIME 타입 스니핑 방지 |
| `X-Frame-Options` | `DENY` | 클릭재킹 방지 (iframe 삽입 차단) |
| `X-XSS-Protection` | `1; mode=block` | 브라우저 내장 XSS 필터 활성화 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | 리퍼러 정보 최소 노출 |
| `Permissions-Policy` | `camera=(), microphone=()...` | 불필요한 브라우저 API 차단 |
| `Strict-Transport-Security` | `max-age=31536000` | HTTPS 강제 (1년) |
| `Content-Security-Policy` | 위 참조 | XSS 공격 방어, 리소스 로딩 제한 |

**CSP 허용 목록**:
- `script-src`: `'self' 'unsafe-inline' 'unsafe-eval'` — Next.js 런타임 필요
- `style-src`: Google Fonts CSS 허용
- `font-src`: Google Fonts 파일 허용
- `img-src`: `data:` (인라인 이미지), `blob:` (PDF 미리보기)
- `frame-ancestors`: `'none'` (X-Frame-Options과 동일 효과)

---

### 3.5 notices/route.ts — HTML Sanitize (FR-07)

**경로**: `src/app/api/admin/notices/route.ts` (수정)

**추가할 sanitize 함수**:

```typescript
function stripHtmlTags(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")   // script 태그 완전 제거
    .replace(/<style[\s\S]*?<\/style>/gi, "")      // style 태그 완전 제거
    .replace(/<[^>]*>/g, "")                        // 모든 HTML 태그 제거
    .replace(/&lt;/g, "<")                          // 이스케이프된 태그도 처리
    .replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "")                        // 2차 제거
    .trim();
}
```

**적용 위치**: POST 핸들러에서 body 저장 전

```typescript
// 기존
title: body.title.trim(),
body: body.body.trim(),

// 변경
title: stripHtmlTags(body.title),
body: stripHtmlTags(body.body),
```

**이메일 발송 시**: `sendNotice` 함수의 HTML 템플릿에서 `body`를 `white-space: pre-wrap`으로 표시하므로, 태그 제거된 plain text가 안전하게 렌더링됨.

---

## 4. Phase 8 — 코드 리뷰 설계

### 4.1 리뷰 범위

Phase 8은 `code-analyzer` 에이전트를 활용하여 자동 분석 후, 발견된 이슈를 수정하는 방식으로 진행.

**리뷰 체크리스트**:

| # | 검사 항목 | 대상 |
|---|----------|------|
| 1 | 미사용 import/변수 | 전체 `.ts`, `.tsx` 파일 |
| 2 | TypeScript 타입 안전성 (`any` 사용 여부) | 전체 |
| 3 | 에러 핸들링 패턴 일관성 | API routes |
| 4 | 환경변수 미설정 시 에러 메시지 | `lib/*.ts` |
| 5 | console.log/error 남용 | 전체 |
| 6 | 보안 관련 코드 검토 | `encrypt.ts`, `auth.ts`, API routes |

### 4.2 리뷰 실행 방식

```
Phase 8 실행 순서:
1. code-analyzer 에이전트 실행 → 이슈 목록 생성
2. 발견된 이슈 중 High/Medium 우선 수정 (최대 5파일)
3. npm run build로 빌드 검증
```

---

## 5. 테스트 계획

### 5.1 Phase 7 검증

| # | 검증 항목 | 방법 | 기대 결과 |
|---|----------|------|----------|
| 1 | robots.txt 접근 | `curl /robots.txt` | Disallow: /admin, /consent, /api |
| 2 | sitemap.xml 접근 | `curl /sitemap.xml` | 유효한 XML, `/` URL 포함 |
| 3 | 보안 헤더 확인 | `curl -I /` | 7종 헤더 모두 포함 |
| 4 | OG 미리보기 | 카카오톡/슬랙 링크 공유 | 제목+설명+이미지 카드 노출 |
| 5 | HTML sanitize | 공지에 `<script>alert(1)</script>` 입력 | 태그 제거된 텍스트만 저장 |
| 6 | CSP 동작 | 페이지 로딩 후 콘솔 확인 | CSP 위반 에러 없음 |

### 5.2 Phase 8 검증

| # | 검증 항목 | 방법 | 기대 결과 |
|---|----------|------|----------|
| 1 | 빌드 성공 | `npm run build` | 에러 0건 |
| 2 | lint 통과 | `npm run lint` | 에러 0건 |

---

## 6. 구현 순서

### 6.1 Phase 7 (SEO/Security) — 5개 파일

```
Step 1: src/app/robots.ts          ← 신규 (FR-01)
Step 2: src/app/sitemap.ts         ← 신규 (FR-02)
Step 3: src/app/layout.tsx         ← 수정 (FR-03, FR-04, FR-05)
Step 4: src/middleware.ts          ← 신규 (FR-06)
Step 5: src/app/api/admin/notices/route.ts ← 수정 (FR-07)
```

### 6.2 Phase 8 (Review) — code-analyzer 기반

```
Step 6: code-analyzer 에이전트 실행
Step 7: 발견된 이슈 수정 (최대 5파일)
Step 8: npm run build 검증
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-13 | Initial draft | Claude Code |
