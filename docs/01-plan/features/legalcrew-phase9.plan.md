# LegalCrew Academy Phase 9 — UI 다듬기 + 모바일 반응형

> **Summary**: 모바일 반응형 개선 + UI 디테일 다듬기 + Netlify 배포 최적화
>
> **Project**: LegalCrew Academy (강사섭외 시스템)
> **Version**: 1.2
> **Author**: Claude Code
> **Date**: 2026-03-13
> **Status**: Draft

---

## Executive Summary

| 관점 | 내용 |
|------|------|
| **Problem** | 기본 모바일 대응은 되어있으나 초소형 화면(320~360px) 대응 미흡, 어드민 페이지 모바일 UX 부족, 패딩/그리드가 2단계(기본/md)만 존재 |
| **Solution** | 티저 페이지 모바일 반응형 보강, 어드민 모바일 UX 개선(flex-wrap, 카드 크기), 동의서 페이지 모바일 최적화, Netlify 배포 설정 점검 |
| **Function/UX Effect** | 모든 화면 크기에서 깨짐 없는 레이아웃, 어드민 모바일에서도 조작 편의성 확보, 공유 링크 클릭 시 모바일에서 매끄러운 동의서 서명 경험 |
| **Core Value** | 실제 사용자(강사/어드민)의 모바일 접근성 확보로 서비스 완성도 향상. 프로덕션 배포 준비 완료 |

---

## 1. Overview

### 1.1 Purpose

Phase 1~8(MVP + SEO/Security) 완료 후, 프로덕션 배포 전 마지막 단계로 모바일 반응형과 UI 디테일을 다듬는다.

### 1.2 Background

현재 상태 분석 결과:
- **강점**: Curriculum 컴포넌트(PC 테이블/모바일 아코디언 분기), clamp() 유동 타이포, ApplyModal 그리드 반응형
- **약점**:
  - 초소형 화면(320~360px) 대응 미흡
  - 패딩이 2단계만 (`px-6` → `md:px-12`), `sm:` 중간 단계 없음
  - 어드민 필터 버튼 모바일 줄바꿈 미처리
  - 동의서 페이지 반응형 처리 없음 (고정 `max-w-[640px]`)
  - globals.css에 미디어쿼리 0개

### 1.3 Related Documents

- 이전 PDCA: `docs/archive/2026-03/legalcrew-academy/`, `docs/archive/2026-03/legalcrew-phase7-8/`
- 프로토타입: `prototype/teaser_prototype_v7.html`

---

## 2. Scope

### 2.1 In Scope

**모바일 반응형 개선**
- [ ] 티저 페이지 컴포넌트 모바일 반응형 보강 (Hero, Story, Mission, Overview, FAQ, Footer)
- [ ] 어드민 페이지 모바일 UX 개선 (대시보드, 강사 목록, 공지 관리)
- [ ] 동의서 페이지 모바일 최적화
- [ ] ApplyModal 초소형 화면 대응

**UI 디테일**
- [ ] 어드민 필터 버튼 `flex-wrap` 추가
- [ ] 모바일 네비게이션 개선 (어드민 사이드바 or 햄버거 메뉴)

**배포**
- [ ] Netlify 배포 테스트 (`npm run build` 최종 확인)

### 2.2 Out of Scope

- 새로운 기능 추가
- 디자인 컨셉 변경 (다크/골드/크림 유지)
- 성능 최적화 (이미지 lazy loading, 번들 최적화 — 필요 시 별도)
- CI/CD 파이프라인 (Netlify Git 자동배포로 충분)
- FR-08, FR-09 (Phase 7 미구현 항목 — 별도 판단)

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 티저 Hero/Story 초소형(320px) 패딩/글자 크기 조정 | High | Pending |
| FR-02 | Overview 그리드 모바일 2열 → sm:3열 → lg:5열 확인 | Medium | Pending |
| FR-03 | Mission 그리드 모바일 1열 정리 | Medium | Pending |
| FR-04 | 어드민 대시보드 카드 모바일 컴팩트화 | High | Pending |
| FR-05 | 어드민 강사 목록 필터 버튼 flex-wrap | High | Pending |
| FR-06 | 어드민 네비게이션 모바일 대응 | Medium | Pending |
| FR-07 | 동의서 페이지 모바일 레이아웃 최적화 | High | Pending |
| FR-08 | ApplyModal 초소형 화면 패딩/입력 필드 조정 | Medium | Pending |
| FR-09 | Netlify 배포 빌드 최종 확인 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| Responsiveness | 320px~1920px 모든 폭에서 레이아웃 깨짐 없음 | 브라우저 DevTools |
| Build | `npm run build` 에러 0건 | CI |
| UX | 모바일에서 터치 타겟 최소 44px | 수동 확인 |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 320px, 375px, 768px, 1024px, 1440px 폭에서 레이아웃 정상
- [ ] 어드민 모바일에서 모든 기능 조작 가능
- [ ] 동의서 페이지 모바일에서 서명까지 완료 가능
- [ ] `npm run build` 성공
- [ ] Netlify 배포 정상 동작

### 4.2 Quality Criteria

- [ ] 빌드 에러 0건
- [ ] Tailwind 반응형 클래스 일관성 확보

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| 반응형 수정이 PC 레이아웃에 영향 | High | Medium | 모바일 우선(sm:, md:) 추가만, 기존 클래스 변경 최소화 |
| 수정 파일이 5개 초과 가능 | Medium | High | 작업을 2단계로 분할 (티저 → 어드민/동의서) |
| Netlify 배포 시 서버리스 함수 에러 | Medium | Low | 로컬 `netlify dev`로 사전 테스트 |

---

## 6. Architecture Considerations

### 6.1 작업 분할 (5개 파일 원칙)

**Step 1 — 티저 페이지 (5파일 이내)**
1. `src/components/teaser/Hero.tsx` — 모바일 패딩/글자 크기
2. `src/components/teaser/Mission.tsx` — 그리드 모바일 정리
3. `src/components/teaser/Overview.tsx` — 그리드 확인/보강
4. `src/components/teaser/FooterCTA.tsx` — 모바일 패딩
5. `src/components/ApplyModal.tsx` — 초소형 화면 대응

**Step 2 — 어드민 + 동의서 (5파일 이내)**
1. `src/app/admin/page.tsx` — 대시보드 모바일 카드
2. `src/app/admin/instructors/page.tsx` — 필터 flex-wrap + 목록 모바일
3. `src/app/admin/notices/page.tsx` — 모바일 폼 조정
4. `src/app/consent/[token]/page.tsx` — 모바일 레이아웃
5. 어드민 네비게이션 공통 (각 페이지 header 부분)

### 6.2 반응형 전략

| Breakpoint | 화면 | 대응 |
|:----------:|------|------|
| 기본 (0~639px) | 모바일 | 1열, 컴팩트 패딩 |
| `sm:` (640px+) | 큰 모바일/소형 태블릿 | 2열 그리드 시작 |
| `md:` (768px+) | 태블릿 | 3열 그리드, 넓은 패딩 |
| `lg:` (1024px+) | PC | 최종 레이아웃 |

---

## 7. Next Steps

1. [ ] 보스 승인 후 Design 문서 작성
2. [ ] Step 1 (티저 모바일) → Step 2 (어드민/동의서 모바일) 순서 진행
3. [ ] Gap Analysis 실행
4. [ ] Netlify 배포 테스트

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-03-13 | Initial draft | Claude Code |
