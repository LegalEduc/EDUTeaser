# LegalCrew Phase 9 Design Document

> **Summary**: 모바일 반응형 보강 + 어드민/동의서 모바일 UX + 배포 확인
>
> **Project**: LegalCrew Academy (강사섭외 시스템)
> **Version**: 1.2
> **Author**: Claude Code
> **Date**: 2026-03-13
> **Status**: Draft
> **Planning Doc**: [legalcrew-phase9.plan.md](../01-plan/features/legalcrew-phase9.plan.md)

---

## 1. Overview

### 1.1 Design Goals

- 기존 클래스 최소 변경, Tailwind 반응형 클래스(`sm:`, `lg:`) 추가 위주
- 모바일 우선(mobile-first): 기본 스타일 = 모바일, `md:`/`lg:` = PC 확장
- 어드민 네비게이션 모바일 대응 (공통 패턴으로 3개 페이지 동시 해결)

### 1.2 Design Principles

- 기존 PC 레이아웃 깨뜨리지 않기 (추가만, 변경 최소)
- 반응형 breakpoint 3단계: 기본(~639px) → `sm:`(640px+) → `md:`(768px+) → `lg:`(1024px+)
- 터치 타겟 최소 44px (모바일 버튼/링크)

---

## 2. 변경 파일 목록

### Step 1 — 티저 페이지 (5파일)

| # | 파일 | 변경 내용 |
|---|------|----------|
| 1 | `src/components/teaser/Hero.tsx` | 모바일 mb 조정, 최소 글자크기 확보 |
| 2 | `src/components/teaser/Mission.tsx` | 모바일 그리드 간격/패딩 조정 |
| 3 | `src/components/teaser/Overview.tsx` | 초소형 1열 → sm:2열 → lg:5열 |
| 4 | `src/components/teaser/FooterCTA.tsx` | 모바일 패딩 축소 |
| 5 | `src/components/ApplyModal.tsx` | 초소형 패딩 축소, 입력 필드 조정 |

### Step 2 — 어드민 + 동의서 (5파일)

| # | 파일 | 변경 내용 |
|---|------|----------|
| 6 | `src/app/admin/page.tsx` | 네비게이션 모바일 + 대시보드 카드 |
| 7 | `src/app/admin/instructors/page.tsx` | 네비게이션 + 필터 flex-wrap + 목록 카드 |
| 8 | `src/app/admin/notices/page.tsx` | 네비게이션 모바일 |
| 9 | `src/app/consent/[token]/page.tsx` | 모바일 패딩/글자 크기 |
| 10 | `src/components/ConsentForm.tsx` | 모바일 체크박스/버튼 터치 대응 |

---

## 3. 상세 설계

### 3.1 어드민 네비게이션 모바일 (공통 패턴, FR-06)

**현재 문제**: 로고 + 네비 + 로그아웃이 한 줄 flex → 모바일에서 좁아짐

**수정 방안**: 모바일에서 로고/네비를 세로 배치

```
변경 전 (모든 어드민 header):
<header className="... flex items-center justify-between">
  <div className="flex items-center gap-6">
    <h1>LegalCrew Admin</h1>
    <nav className="flex gap-4 text-[13px]">...</nav>
  </div>
  <button>로그아웃</button>
</header>

변경 후:
<header className="... flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div className="flex items-center justify-between">
    <h1>LegalCrew Admin</h1>
    <button className="sm:hidden ...">로그아웃</button>  ← 모바일: 로고 옆
  </div>
  <nav className="flex gap-3 text-[13px] overflow-x-auto">...</nav>
  <button className="hidden sm:block ...">로그아웃</button>  ← PC: 우측
</header>
```

**핵심**: `flex-col sm:flex-row`로 모바일 세로/PC 가로 전환. 로그아웃 버튼은 모바일에서 로고 옆, PC에서 우측.

---

### 3.2 Hero.tsx (FR-01)

**변경 사항**: 최소한의 모바일 간격 조정

```diff
- className="min-h-screen flex items-center justify-center px-6 md:px-12 text-center ..."
+ className="min-h-screen flex items-center justify-center px-5 sm:px-6 md:px-12 text-center ..."

- className="... text-gold mb-12"
+ className="... text-gold mb-8 sm:mb-12"

- className="font-heading text-[clamp(30px,5.5vw,60px)] ... mb-8"
+ className="font-heading text-[clamp(26px,5.5vw,60px)] ... mb-6 sm:mb-8"
```

**포인트**: clamp 최솟값 30→26px (초소형 화면에서 여유 확보), mb 축소

---

### 3.3 Mission.tsx (FR-03)

**변경 사항**: 모바일 그리드 간격 개선

```diff
- className="... grid grid-cols-1 md:grid-cols-[64px_200px_1fr] items-center gap-4 md:gap-8
-            bg-white/[0.02] border ... px-6 md:px-12 py-8 md:py-10 ..."
+ className="... grid grid-cols-1 md:grid-cols-[64px_200px_1fr] items-start md:items-center gap-2 md:gap-8
+            bg-white/[0.02] border ... px-5 sm:px-6 md:px-12 py-6 sm:py-8 md:py-10 ..."
```

**포인트**: 모바일에서 `items-start` (숫자/제목/설명 왼쪽 정렬), gap/padding 축소

---

### 3.4 Overview.tsx (FR-02)

**변경 사항**: 초소형 화면에서 1열 그리드

```diff
- className="... grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12 ..."
+ className="... grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-12 ..."
```

**포인트**: 320px에서 `grid-cols-1` → 640px+ `sm:grid-cols-2` → 768px+ `md:grid-cols-3`

---

### 3.5 FooterCTA.tsx (FR-01)

**변경 사항**: 패딩만 조정

```diff
- className="py-28 md:py-44 px-6 md:px-12"
+ className="py-20 sm:py-28 md:py-44 px-5 sm:px-6 md:px-12"
```

---

### 3.6 ApplyModal.tsx (FR-08)

**변경 사항**: 초소형 패딩 축소

```diff
- className="... p-8 md:p-14 ..."
+ className="... p-5 sm:p-8 md:p-14 ..."
```

**포인트**: 모바일 p-5(20px)로 입력 필드에 더 넓은 공간 확보

---

### 3.7 어드민 대시보드 (FR-04)

**변경 사항**: 카드 그리드 sm 단계 추가

```diff
- className="grid grid-cols-1 md:grid-cols-3 gap-4"
+ className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
```

**포인트**: sm(640px)부터 3열 (태블릿에서도 한눈에 보이게)

---

### 3.8 강사 목록 필터 (FR-05)

**변경 사항**: 필터 버튼 flex-wrap + 제목/필터 세로 배치

```diff
- <div className="flex items-center justify-between mb-8">
-   <h2>강사 관리</h2>
-   <div className="flex gap-2">
+ <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
+   <h2>강사 관리</h2>
+   <div className="flex flex-wrap gap-2">
```

**강사 카드 상세 정보 줄바꿈**:
```diff
- <div className="mt-2 flex gap-4 text-[12px] text-muted">
+ <div className="mt-2 flex flex-col sm:flex-row gap-1 sm:gap-4 text-[12px] text-muted">
```

---

### 3.9 동의서 페이지 (FR-07)

**변경 사항**: 패딩/글자 크기 모바일 조정

```diff
- <div className="max-w-[640px] mx-auto px-6 py-12">
+ <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-8 sm:py-12">

- <h1 className="font-heading text-[26px] font-bold mb-3">
+ <h1 className="font-heading text-[22px] sm:text-[26px] font-bold mb-3">
```

---

### 3.10 ConsentForm.tsx (FR-07)

**변경 사항**: 체크박스 터치 영역 확보, 제출 버튼 full-width 모바일

```
체크박스 label: min-h-[44px] 추가 (터치 타겟)
제출 버튼: w-full sm:w-auto
```

---

## 4. 테스트 계획

| # | 검증 항목 | 방법 | 기대 결과 |
|---|----------|------|----------|
| 1 | 320px 티저 | DevTools 320px | Hero/Mission/Overview 깨짐 없음 |
| 2 | 375px 모달 | DevTools 375px | ApplyModal 입력 필드 정상 |
| 3 | 768px 어드민 | DevTools 768px | 대시보드 3열, 네비 가로 |
| 4 | 320px 어드민 | DevTools 320px | 네비 세로, 필터 줄바꿈 |
| 5 | 375px 동의서 | DevTools 375px | 체크박스 터치 가능, 버튼 full |
| 6 | 1440px PC | DevTools 1440px | 기존 레이아웃 변경 없음 |
| 7 | 빌드 | `npm run build` | 에러 0건 |

---

## 5. 구현 순서

```
Step 1 (티저 5파일):
  1. Hero.tsx
  2. Mission.tsx
  3. Overview.tsx
  4. FooterCTA.tsx
  5. ApplyModal.tsx

Step 2 (어드민+동의서 5파일):
  6. admin/page.tsx (대시보드 + 네비)
  7. admin/instructors/page.tsx (필터 + 목록 + 네비)
  8. admin/notices/page.tsx (네비)
  9. consent/[token]/page.tsx
  10. ConsentForm.tsx
```

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-13 | Initial draft | Claude Code |
