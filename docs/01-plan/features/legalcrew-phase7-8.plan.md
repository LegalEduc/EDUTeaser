# LegalCrew Academy Phase 7~8 — SEO/Security + Review

> **Summary**: MVP 이후 SEO 최적화, 보안 강화, 코드 품질 리뷰
>
> **Project**: LegalCrew Academy (강사섭외 시스템)
> **Version**: 1.1
> **Author**: Claude Code
> **Date**: 2026-03-13
> **Status**: Draft

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | MVP 구현 후 SEO 메타데이터 부족(OG 이미지, robots.txt, sitemap 없음), 보안 헤더 미적용, XSS 취약점 잠재, 코드 품질 검증 미실시 |
| **Solution** | Phase 7: SEO 메타 완성(OG/Twitter/canonical) + 보안 헤더(CSP, X-Frame 등) + 입력값 sanitize 강화. Phase 8: 전체 코드 리뷰 + 아키텍처 일관성 검증 |
| **Function/UX Effect** | SEO: 카카오톡/슬랙 공유 시 미리보기 카드 정상 노출, 검색 엔진 인덱싱 최적화. Security: XSS/클릭재킹 방어, 민감 정보 보호 강화. Review: 코드 일관성 확보, 잠재 버그 사전 제거 |
| **Core Value** | 외부 공개 전 프로덕션 레디 품질 확보. 보안 취약점 사전 차단으로 개인정보(주민번호, 계좌) 보호 강화 |

---

## 1. Overview

### 1.1 Purpose

Phase 1~6 MVP 구현 완료 후, 프로덕션 배포 전 필수 작업인 SEO 최적화와 보안 강화를 수행하고, 전체 코드 리뷰를 통해 품질을 검증한다.

### 1.2 Background

- MVP 구현 시 기능 중심으로 진행하여 SEO/보안은 최소한만 적용됨
- 현재 상태:
  - SEO: 기본 메타데이터만 있음 (title, description, OG title/description). robots.txt, sitemap.xml, OG 이미지, canonical URL 없음
  - 보안: AES-256-GCM 암호화, JWT 인증, Rate Limiting(신청 API만) 적용됨. 보안 헤더(CSP, X-Frame-Options 등) 미적용, HTML 입력 sanitize 불완전
  - 코드 리뷰: 아직 수행하지 않음

### 1.3 Related Documents

- 이전 PDCA: `docs/archive/2026-03/legalcrew-academy/`
- 프로젝트 지침: `CLAUDE.md`

---

## 2. Scope

### 2.1 In Scope

**Phase 7 — SEO/Security**
- [ ] SEO 메타데이터 완성 (OG image, Twitter Card, canonical)
- [ ] robots.txt + sitemap.xml 생성
- [ ] 보안 헤더 추가 (CSP, X-Frame-Options, X-Content-Type-Options 등)
- [ ] 입력값 sanitize 강화 (공지 body의 HTML 주입 방지)
- [ ] 어드민 API Rate Limiting 추가
- [ ] 에러 응답에서 스택트레이스 노출 방지

### 2.2 In Scope (continued)

**Phase 8 — Review**
- [ ] 전체 코드 아키텍처 일관성 검증
- [ ] 미사용 코드/import 정리
- [ ] TypeScript 타입 안전성 검토
- [ ] 에러 핸들링 패턴 일관성 확인
- [ ] 환경변수 누락 검증

### 2.3 Out of Scope

- UI/UX 디자인 변경 (Phase 9에서 별도)
- 모바일 반응형 개선 (Phase 9)
- 새로운 기능 추가
- 성능 최적화 (이미지 최적화, 번들 사이즈 등)
- CI/CD 파이프라인 구성 (Phase 9)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | robots.txt에 어드민/동의서 경로 Disallow | High | Pending |
| FR-02 | sitemap.xml에 공개 페이지(/) 등록 | Medium | Pending |
| FR-03 | OG 이미지 메타태그 (1200x630) | Medium | Pending |
| FR-04 | Twitter Card 메타태그 | Low | Pending |
| FR-05 | canonical URL 설정 | Medium | Pending |
| FR-06 | 보안 헤더 middleware 추가 | High | Pending |
| FR-07 | 공지 body HTML sanitize | High | Pending |
| FR-08 | 어드민 API Rate Limiting | Medium | Pending |
| FR-09 | 프로덕션 에러 응답 정리 (스택트레이스 제거) | Medium | Pending |
| FR-10 | 코드 리뷰 + 리팩토링 (일관성 개선) | Medium | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Security | OWASP Top 10 주요 항목 대응 | 수동 체크리스트 |
| SEO | Lighthouse SEO 점수 90+ | Lighthouse 리포트 |
| Code Quality | TypeScript strict 에러 0건 | `npm run build` |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] robots.txt + sitemap.xml 정상 접근
- [ ] 카카오톡/슬랙 링크 공유 시 미리보기 카드 노출
- [ ] 보안 헤더 응답 확인 (curl -I)
- [ ] 공지 body에 `<script>` 태그 입력 시 무해화 확인
- [ ] 코드 리뷰 완료, 발견된 이슈 수정

### 4.2 Quality Criteria

- [ ] `npm run build` 에러 없음
- [ ] lint 에러 없음
- [ ] 보안 헤더 6종 이상 적용

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| CSP 설정이 너무 엄격하면 폰트/이미지 로딩 차단 | High | Medium | Google Fonts, 자체 도메인을 허용 목록에 추가 |
| OG 이미지 없이 배포 시 공유 미리보기 미노출 | Low | High | 기본 플레이스홀더 이미지 사용 |
| robots.txt Disallow가 과도하면 검색 노출 저하 | Medium | Low | 공개 페이지(/)만 Allow, 나머지 Disallow |

---

## 6. Architecture Considerations

### 6.1 Project Level

| Level | Selected |
|-------|:--------:|
| **Dynamic** | ✅ |

### 6.2 Phase 7 구현 방식

| 항목 | 방식 | 근거 |
|------|------|------|
| 보안 헤더 | Next.js middleware.ts | 모든 응답에 일괄 적용 가능 |
| robots.txt | `src/app/robots.ts` (Next.js 내장) | App Router 표준 방식 |
| sitemap | `src/app/sitemap.ts` (Next.js 내장) | App Router 표준 방식 |
| HTML sanitize | 서버사이드에서 태그 제거 | 외부 라이브러리 없이 간단 처리 |

### 6.3 변경 파일 예상 (5개 이내 원칙)

**Phase 7 (SEO/Security):**
1. `src/app/robots.ts` — 신규
2. `src/app/sitemap.ts` — 신규
3. `src/app/layout.tsx` — 메타데이터 보강
4. `src/middleware.ts` — 보안 헤더 (신규)
5. `src/app/api/admin/notices/route.ts` — body sanitize

**Phase 8 (Review):**
- 코드 리뷰 결과에 따라 결정 (최대 5개)

---

## 7. Convention Prerequisites

### 7.1 기존 Convention

- [x] `CLAUDE.md` 코딩 가이드라인
- [x] TypeScript strict mode
- [x] Tailwind CSS 스타일링
- [x] ESLint 설정

### 7.2 환경변수 (기존)

| Variable | Purpose | 상태 |
|----------|---------|:----:|
| `DATABASE_URL` | Netlify DB 연결 | ✅ |
| `JWT_SECRET` | JWT 서명 | ✅ |
| `ADMIN_PASSWORD_HASH` | 어드민 비밀번호 | ✅ |
| `ENCRYPTION_KEY` | AES-256 암호화 키 | ✅ |
| `RESEND_API_KEY` | 이메일 발송 | ✅ |
| `NEXT_PUBLIC_BASE_URL` | 베이스 URL | ✅ |
| `EMAIL_FROM` | 발송 이메일 주소 | ✅ |

---

## 8. Next Steps

1. [ ] 보스 승인 후 Design 문서 작성 (`/pdca design legalcrew-phase7-8`)
2. [ ] Phase 7 구현 → Phase 8 리뷰 순서로 진행
3. [ ] Gap Analysis 실행

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-13 | Initial draft | Claude Code |
