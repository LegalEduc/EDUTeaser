# LegalCrew Phase 7~8 Analysis Report

> **Analysis Type**: Gap Analysis (Design vs Implementation)
>
> **Project**: LegalCrew Academy (강사섭외 시스템)
> **Version**: 2.0
> **Analyst**: Claude Code
> **Date**: 2026-03-13
> **Design Doc**: [legalcrew-phase7-8.design.md](../02-design/features/legalcrew-phase7-8.design.md)
> **Plan Doc**: [legalcrew-phase7-8.plan.md](../01-plan/features/legalcrew-phase7-8.plan.md)

---

## 1. Analysis Overview

### 1.1 Analysis Purpose

Design 문서(Phase 7~8)에서 정의한 FR-01 ~ FR-10 요구사항과 실제 구현 코드 6개 파일을 비교하여 일치율을 산출하고, 누락/변경/추가 사항을 식별한다.

### 1.2 Analysis Scope

- **Design Document**: `docs/02-design/features/legalcrew-phase7-8.design.md`
- **Plan Document**: `docs/01-plan/features/legalcrew-phase7-8.plan.md`
- **Implementation Files**:
  1. `src/app/robots.ts`
  2. `src/app/sitemap.ts`
  3. `src/app/layout.tsx`
  4. `src/middleware.ts`
  5. `src/app/api/admin/notices/route.ts`
  6. `src/app/opengraph-image.tsx` (추가 -- Design의 정적 파일 대체)
- **Analysis Date**: 2026-03-13
- **Re-analysis**: v1.0에서 발견된 Gap 2건 수정 후 재검증

### 1.3 v1.0 Gap 수정 내역

| # | Gap (v1.0) | 수정 내용 | 검증 결과 |
|---|-----------|----------|:---------:|
| 1 | FR-07: `stripHtmlTags`에 `&lt;`/`&gt;` 디코드 + 2차 제거 누락 | `&lt;`/`&gt;`/`&amp;`/`&quot;`/`&#x27;` 디코드 + 2차 태그 제거 추가 | ✅ 해결 |
| 2 | FR-03: `public/og-image.png` 파일 없음 | `src/app/opengraph-image.tsx`로 Next.js OG Image Generation 구현 (1200x630, 프로젝트 색상) | ✅ 해결 |

---

## 2. Overall Scores

| Category | Score (v1.0) | Score (v2.0) | Status |
|----------|:------------:|:------------:|:------:|
| Design Match (FR-01~FR-07) | 93% | **100%** | ✅ |
| Plan Coverage (FR-01~FR-10) | 70% | **70%** | ⚠️ |
| Architecture Compliance | 100% | **100%** | ✅ |
| Convention Compliance | 100% | **100%** | ✅ |
| **Overall** | **88%** | **93%** | ✅ |

---

## 3. Gap Analysis: FR 요구사항 vs 구현

### 3.1 FR별 상세 비교

| FR | 요구사항 | Design 명세 | 구현 | 상태 | 비고 |
|----|----------|------------|------|:----:|------|
| FR-01 | robots.txt Disallow | `src/app/robots.ts` 신규 | `src/app/robots.ts` | ✅ | 완전 일치 |
| FR-02 | sitemap.xml 생성 | `src/app/sitemap.ts` 신규 | `src/app/sitemap.ts` | ✅ | 완전 일치 |
| FR-03 | OG 이미지 메타태그 | layout.tsx OG 메타 + `public/og-image.png` | layout.tsx OG 메타 + `opengraph-image.tsx` | ✅ | 구현 방식 변경, 의도 충족 (v2.0 해결) |
| FR-04 | Twitter Card 메타태그 | layout.tsx twitter 속성 | layout.tsx twitter 적용 | ✅ | 완전 일치 |
| FR-05 | canonical URL | layout.tsx alternates | layout.tsx alternates | ✅ | 완전 일치 |
| FR-06 | 보안 헤더 middleware | `src/middleware.ts` 7종 | `src/middleware.ts` 7종 | ✅ | 완전 일치 |
| FR-07 | HTML sanitize | notices/route.ts stripHtmlTags 6단계 | notices/route.ts stripHtmlTags 8단계 | ✅ | 구현이 Design 초과 (v2.0 해결) |
| FR-08 | 어드민 API Rate Limiting | Plan에만 정의, Design 미설계 | 미구현 | ❌ | 미구현 |
| FR-09 | 에러 응답 스택트레이스 제거 | Plan에만 정의, Design 미설계 | 미구현 | ❌ | 미구현 |
| FR-10 | 코드 리뷰 + 리팩토링 | Design Phase 8 섹션 정의 | 미구현 (별도 진행 필요) | ❌ | Phase 8 영역 |

---

### 3.2 상세 차이 분석

#### FR-01: robots.ts -- 완전 일치

| 항목 | Design | 구현 | 일치 |
|------|--------|------|:----:|
| userAgent | `*` | `*` | ✅ |
| allow | `/` | `/` | ✅ |
| disallow | `/admin`, `/admin/*`, `/consent`, `/consent/*`, `/api/*` | 동일 | ✅ |
| sitemap URL | 하드코딩 `https://academy.legalcrew.co.kr/sitemap.xml` | `${baseUrl}/sitemap.xml` (동적) | ✅ |

구현이 Design보다 개선됨: sitemap URL을 환경변수 기반 동적 생성으로 구현. Design 설계 포인트("`NEXT_PUBLIC_BASE_URL` 기반으로 동적 생성")와 일치.

#### FR-02: sitemap.ts -- 완전 일치

Design 코드 스니펫과 구현 코드가 동일.

#### FR-03: OG 이미지 -- 완전 일치 (v2.0 해결)

| 항목 | Design | 구현 | 일치 |
|------|--------|------|:----:|
| title | ✅ | ✅ | ✅ |
| description | ✅ | ✅ | ✅ |
| metadataBase | ✅ | ✅ | ✅ |
| canonical | ✅ | ✅ | ✅ |
| OG title/description/type/locale/siteName | ✅ | ✅ | ✅ |
| OG images (1200x630) | `public/og-image.png` (정적) | `opengraph-image.tsx` (동적 생성) | ✅ |
| twitter card | ✅ | ✅ | ✅ |
| robots index/follow | ✅ | ✅ | ✅ |

**v2.0 변경사항**: Design은 `public/og-image.png` 정적 파일을 명시했으나, 구현은 `src/app/opengraph-image.tsx`로 Next.js OG Image Generation API를 활용. 이 방식은:
- 1200x630 사이즈 동일
- 프로젝트 색상(다크 `#0f0f1e` + 골드 `#c4993c` + 크림 `#faf8f5`) 적용
- Next.js가 자동으로 OG/Twitter 메타태그에 연결 (수동 경로 지정 불필요)
- Design 의도(OG 이미지 존재 + SNS 미리보기 정상 동작) 완전 충족

layout.tsx에서 `openGraph.images`와 `twitter.images`를 제거하고 주석으로 `opengraph-image.tsx` 자동 적용을 명시한 것도 적절.

#### FR-04~05: Twitter Card, canonical -- 완전 일치

변경 없음.

#### FR-06: middleware.ts 보안 헤더 -- 완전 일치

7종 헤더 및 CSP 정책이 Design과 정확히 일치:

| 헤더 | Design 값 | 구현 값 | 일치 |
|------|----------|---------|:----:|
| X-Content-Type-Options | nosniff | nosniff | ✅ |
| X-Frame-Options | DENY | DENY | ✅ |
| X-XSS-Protection | 1; mode=block | 1; mode=block | ✅ |
| Referrer-Policy | strict-origin-when-cross-origin | strict-origin-when-cross-origin | ✅ |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | 동일 | ✅ |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | 동일 | ✅ |
| Content-Security-Policy | 7개 지시문 | 동일 | ✅ |

matcher 패턴도 동일: `/((?!_next/static|_next/image|favicon.ico).*)`.

#### FR-07: HTML Sanitize -- 완전 일치 (v2.0 해결)

| 항목 | Design | 구현 | 일치 |
|------|--------|------|:----:|
| script 태그 제거 | ✅ | ✅ | ✅ |
| style 태그 제거 | ✅ | ✅ | ✅ |
| 일반 HTML 태그 제거 | ✅ | ✅ | ✅ |
| `&lt;`/`&gt;` 디코드 | ✅ | ✅ | ✅ |
| `&amp;`/`&quot;`/`&#x27;` 디코드 | 없음 | ✅ (추가) | ✅ |
| 2차 태그 제거 | ✅ | ✅ | ✅ |
| trim | ✅ | ✅ | ✅ |
| title에도 적용 | ✅ | ✅ | ✅ |
| body에도 적용 | ✅ | ✅ | ✅ |

**v2.0 변경사항**: 구현이 Design을 초과하여 `&amp;`, `&quot;`, `&#x27;` 3종 엔티티 디코드를 추가 적용. 더 포괄적인 sanitize로 보안성 향상.

---

## 4. Missing Features (Design O, Implementation X)

### 4.1 Design에서 정의되었으나 미구현

없음. Design 문서(Section 3)에서 정의한 5개 파일 + OG 이미지 모두 구현됨.

### 4.2 Plan에서 정의되었으나 Design/구현 모두 누락

| Item | Plan 위치 | 설명 | 영향도 |
|------|-----------|------|--------|
| FR-08: 어드민 API Rate Limiting | plan.md:89 | 어드민 API에 Rate Limiting 추가 | Medium |
| FR-09: 에러 응답 스택트레이스 제거 | plan.md:90 | 프로덕션 에러 응답에서 스택트레이스 노출 방지 | Medium |
| FR-10: 코드 리뷰 + 리팩토링 | plan.md:91, design.md Section 4 | Phase 8 영역, 별도 실행 필요 | Medium |

---

## 5. Changed Features (Design != Implementation)

| Item | Design | Implementation | Impact |
|------|--------|----------------|--------|
| robots.ts sitemap URL | 하드코딩 문자열 | 환경변수 기반 동적 생성 | Low (개선) |
| OG 이미지 방식 | `public/og-image.png` 정적 파일 | `src/app/opengraph-image.tsx` 동적 생성 | Low (개선) |
| stripHtmlTags 함수 | 6단계 (2종 엔티티 디코드) | 8단계 (5종 엔티티 디코드) | Low (개선) |
| middleware 파라미터 | `request: NextRequest` | `_request: NextRequest` (unused prefix) | None (스타일) |
| layout.tsx OG/Twitter images | 명시적 경로 지정 | 제거 (opengraph-image.tsx 자동 연결) | None (Next.js 표준) |

모든 변경은 Design 의도를 충족하거나 초과하는 개선 사항.

---

## 6. Added Features (Design X, Implementation O)

| Item | Implementation 위치 | 설명 |
|------|---------------------|------|
| `src/app/opengraph-image.tsx` | `src/app/opengraph-image.tsx` | Design에 없던 파일이나 FR-03 OG 이미지 요구사항을 대체 구현 |

Design 범위를 벗어나는 의도치 않은 추가 기능은 없음.

---

## 7. Architecture Compliance

### 7.1 파일 배치 검증

| 파일 | Design 경로 | 구현 경로 | 일치 |
|------|------------|----------|:----:|
| robots.ts | `src/app/robots.ts` | `src/app/robots.ts` | ✅ |
| sitemap.ts | `src/app/sitemap.ts` | `src/app/sitemap.ts` | ✅ |
| layout.tsx | `src/app/layout.tsx` | `src/app/layout.tsx` | ✅ |
| middleware.ts | `src/middleware.ts` | `src/middleware.ts` | ✅ |
| notices/route.ts | `src/app/api/admin/notices/route.ts` | `src/app/api/admin/notices/route.ts` | ✅ |
| opengraph-image.tsx | (Design 미정의) | `src/app/opengraph-image.tsx` | ✅ (Next.js 표준 위치) |

### 7.2 Middleware 적용 범위

Design에서 정의한 대로 정적 파일 제외, 모든 요청에 보안 헤더가 적용됨.

---

## 8. Convention Compliance

### 8.1 Naming Convention

| Category | Convention | 검사 파일 수 | Compliance | 위반 |
|----------|-----------|:-----------:|:----------:|------|
| 파일명 | camelCase.ts / PascalCase.tsx | 6 | 100% | - |
| 함수명 | camelCase | 6 | 100% | - |
| 상수명 | UPPER_SNAKE_CASE (해당 없음) | - | - | - |

### 8.2 Import Order

모든 6개 파일에서 외부 라이브러리 > 내부 절대경로 > 상대경로 순서 준수.

### 8.3 Convention Score

```
Convention Compliance: 100%
  Naming:           100%
  File Placement:   100%
  Import Order:     100%
```

---

## 9. Match Rate Summary

```
+---------------------------------------------------+
|  Design vs Implementation Match Rate (v2.0)        |
+---------------------------------------------------+
|  FR-01 robots.txt              100%                |
|  FR-02 sitemap.xml             100%                |
|  FR-03 OG image meta           100% (v2.0 해결)    |
|  FR-04 Twitter Card            100%                |
|  FR-05 canonical URL           100%                |
|  FR-06 보안 헤더 7종            100%                |
|  FR-07 HTML sanitize           100% (v2.0 해결)    |
+---------------------------------------------------+
|  Design Match (FR-01~07):      100%                |
+---------------------------------------------------+
|  FR-08 Rate Limiting             0% (미구현)        |
|  FR-09 스택트레이스 제거          0% (미구현)        |
|  FR-10 코드 리뷰                 0% (별도 진행)      |
+---------------------------------------------------+
|  Plan Coverage (FR-01~10):      70%                |
+---------------------------------------------------+
|  Overall Match Rate:            93%                |
+---------------------------------------------------+
```

**판정**: Design 문서 기준 **100% 일치** (v1.0 대비 +7%p), Plan 문서 전체 기준 70% (FR-08~10은 Design 미설계 + 미구현)

---

## 10. Recommended Actions

### 10.1 Immediate (High Priority)

**없음.** v1.0에서 식별된 Gap 2건이 모두 해결됨.

### 10.2 Short-term (Plan 요구사항 충족)

| # | 항목 | 관련 FR | 설명 |
|---|------|---------|------|
| 1 | 어드민 API Rate Limiting 구현 | FR-08 | `/api/admin/*` 엔드포인트에 Rate Limiting 적용 |
| 2 | 에러 응답 스택트레이스 제거 | FR-09 | 프로덕션 환경에서 `err.stack` 노출 방지 |
| 3 | Phase 8 코드 리뷰 실행 | FR-10 | code-analyzer 에이전트 실행 또는 수동 리뷰 |

### 10.3 Design Document Update

| # | 항목 | 설명 |
|---|------|------|
| 1 | FR-08, FR-09 Design 추가 | Plan에는 있지만 Design 상세 설계가 누락됨. Design 문서에 섹션 추가 필요 |
| 2 | OG 이미지 방식 반영 | Design Section 3.3에 `opengraph-image.tsx` 방식 반영 (현재는 `public/og-image.png` 기술) |
| 3 | stripHtmlTags 확장 반영 | Design Section 3.5에 `&amp;`/`&quot;`/`&#x27;` 디코드 3종 추가 반영 |

---

## 11. Synchronization Options

| Option | 설명 | 추천 |
|--------|------|:----:|
| 1. Design을 구현에 맞춰 업데이트 | OG 이미지 방식, stripHtmlTags 확장 반영 | ✅ |
| 2. FR-08, FR-09를 Design에 추가 후 구현 | Plan 요구사항을 Design으로 상세화 후 구현 진행 | ✅ |
| 3. FR-08, FR-09를 다음 Phase로 이월 | Phase 9로 미루기 | ⚠️ |

---

## 12. Next Steps

- [x] `stripHtmlTags` 디코드 단계 추가 (FR-07 완전 일치) -- v2.0 해결
- [x] OG 이미지 구현 (FR-03 완전 일치) -- v2.0 해결 (`opengraph-image.tsx`)
- [ ] Design 문서에 구현 변경사항 반영 (OG 방식, stripHtmlTags 확장)
- [ ] FR-08, FR-09 처리 방향 결정 (구현 vs 이월)
- [ ] Phase 8 코드 리뷰 별도 실행

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-13 | Initial gap analysis (Match Rate 93%) | Claude Code |
| 2.0 | 2026-03-13 | Re-analysis: Gap 2건 해결 확인, Match Rate 100% (Design 기준) | Claude Code |
