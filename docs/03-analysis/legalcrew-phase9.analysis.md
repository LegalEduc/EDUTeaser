# LegalCrew Phase 9 Gap Analysis

> Design vs Implementation comparison for Phase 9 (UI Mobile Responsive)
>
> **Design Document**: `docs/02-design/features/legalcrew-phase9.design.md`
> **Analysis Date**: 2026-03-13
> **Status**: Completed

---

## Summary

| Metric | Value |
|--------|-------|
| Match Rate | **93%** |
| Total Items | 15 |
| Matched | 13 |
| Gaps | 2 |
| Extras | 1 |

## Overall Scores

| Category | Score | Status |
|----------|:-----:|:------:|
| Design Match | 87% | ⚠️ |
| Architecture Compliance | 100% | ✅ |
| Convention Compliance | 100% | ✅ |
| **Overall** | **93%** | ✅ |

---

## Detailed Analysis

### 3.1 Admin Navigation Mobile (admin/page.tsx, instructors/page.tsx, notices/page.tsx)

**Status**: ✅ Match

Design specifies the shared pattern across 3 admin pages:
- `flex-col sm:flex-row sm:items-center sm:justify-between gap-3` on header
- Mobile logout button with `sm:hidden` next to logo
- PC logout button with `hidden sm:block` at right
- Nav with `flex gap-3 text-[13px] overflow-x-auto`
- `whitespace-nowrap` on nav links

All 3 files (`admin/page.tsx`, `admin/instructors/page.tsx`, `admin/notices/page.tsx`) implement this pattern identically and correctly.

---

### 3.2 Hero.tsx (FR-01)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `px-5 sm:px-6 md:px-12` | `px-5 sm:px-6 md:px-12` | ✅ |
| `mb-8 sm:mb-12` (subtitle) | `mb-8 sm:mb-12` | ✅ |
| `text-[clamp(26px,5.5vw,60px)]` | `text-[clamp(26px,5.5vw,60px)]` | ✅ |
| `mb-6 sm:mb-8` (heading) | `mb-6 sm:mb-8` | ✅ |

---

### 3.3 Mission.tsx (FR-03)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `items-start md:items-center` | `items-start md:items-center` | ✅ |
| `gap-2 md:gap-8` | `gap-2 md:gap-8` | ✅ |
| `px-5 sm:px-6 md:px-12` | `px-5 sm:px-6 md:px-12` | ✅ |
| `py-6 sm:py-8 md:py-10` | `py-6 sm:py-8 md:py-10` | ✅ |

---

### 3.4 Overview.tsx (FR-02)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5` | `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5` | ✅ |
| `gap-6 sm:gap-8 md:gap-12` | `gap-6 sm:gap-8 md:gap-12` | ✅ |

---

### 3.5 FooterCTA.tsx (FR-01)

**Status**: ⚠️ Partial Match (1 gap)

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `py-20 sm:py-28 md:py-44` | `py-20 sm:py-36 md:py-44` | ❌ |
| `px-5 sm:px-6 md:px-12` | `px-5 sm:px-6 md:px-12` | ✅ |

**Gap**: `sm:py-28` (design) vs `sm:py-36` (implementation). sm breakpoint의 세로 패딩이 설계보다 크게 구현됨 (112px vs 144px).

---

### 3.6 ApplyModal.tsx (FR-08)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `p-5 sm:p-8 md:p-14` | `p-5 sm:p-8 md:p-14` | ✅ |

---

### 3.7 Admin Dashboard Cards (FR-04)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4` | `grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4` | ✅ |

---

### 3.8 Instructors Filter/List (FR-05)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| Title/filter `flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8` | Exact match | ✅ |
| Filter buttons `flex-wrap gap-2` | `flex flex-wrap gap-2` | ✅ |
| Card detail `flex-col sm:flex-row gap-1 sm:gap-4` | `flex flex-col sm:flex-row gap-1 sm:gap-4` | ✅ |

---

### 3.9 Consent Page (FR-07)

**Status**: ✅ Match

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| `px-4 sm:px-6 py-8 sm:py-12` | `px-4 sm:px-6 py-8 sm:py-12` | ✅ |
| `text-[22px] sm:text-[26px]` (h1) | `text-[22px] sm:text-[26px]` | ✅ |

---

### 3.10 ConsentForm.tsx (FR-07)

**Status**: ⚠️ Partial Match (1 gap, 1 extra)

| Design Spec | Implementation | Match |
|-------------|---------------|:-----:|
| Checkbox label `min-h-[44px]` | All 5 labels have `min-h-[44px] py-1` | ✅ |
| Submit button `w-full sm:w-auto` | `w-full` (no `sm:w-auto`) | ❌ |

**Gap**: Submit button is always full-width. Design specified `sm:w-auto` for desktop, which would make the button auto-width on sm+ screens.

**Extra**: Signature input uses `w-full sm:w-1/2` -- not specified in design but a reasonable responsive improvement.

---

## Gaps List

| # | Section | File | Design Spec | Actual | Impact |
|---|---------|------|-------------|--------|--------|
| 1 | 3.5 | `src/components/teaser/FooterCTA.tsx` | `sm:py-28` | `sm:py-36` | Low - visual spacing difference only |
| 2 | 3.10 | `src/components/ConsentForm.tsx` | Submit button `w-full sm:w-auto` | `w-full` only | Low - button remains usable, just wider on desktop |

## Extras List

| # | Section | File | Implementation | Description |
|---|---------|------|---------------|-------------|
| 1 | 3.10 | `src/components/ConsentForm.tsx` | Signature input `w-full sm:w-1/2` | Responsive width on signature input, not in design but improves UX |

---

## Recommendations

### Option 1: Implementation 수정 (설계 기준으로 맞추기)

1. `FooterCTA.tsx`: `sm:py-36` -> `sm:py-28`로 변경
2. `ConsentForm.tsx`: Submit button에 `sm:w-auto` 추가

### Option 2: Design 문서 업데이트 (구현 기준으로 맞추기)

1. `FooterCTA.tsx`의 `sm:py-36`이 시각적으로 더 나은 경우 설계 반영
2. Submit button `w-full`이 모바일/PC 모두 적합하다면 설계에서 `sm:w-auto` 제거
3. ConsentForm 서명 입력 `w-full sm:w-1/2` 추가 반영

### 판단 기준

두 Gap 모두 **Low Impact**이며 기능에 영향 없음. Match Rate 93%로 기준(90%) 충족.
현재 구현이 사용자 경험상 문제없다면 **Option 2 (설계 업데이트)** 권장.

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-03-13 | Initial gap analysis | Claude Code |
