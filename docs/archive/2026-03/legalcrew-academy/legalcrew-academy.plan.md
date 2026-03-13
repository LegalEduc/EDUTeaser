# Plan: LegalCrew Academy 강사섭외 시스템

> Feature: legalcrew-academy
> Created: 2026-03-13
> Status: Plan

---

## Executive Summary

| 항목 | 내용 |
|------|------|
| Feature | LegalCrew Academy 강사섭외 시스템 전체 구현 |
| 시작일 | 2026-03-13 |
| 목표 완료일 | 8 Phase 순차 구현 |

### Value Delivered

| 관점 | 내용 |
|------|------|
| **Problem** | 강사(멘토) 섭외 과정이 수동(이메일/전화)으로 진행되어 비효율적이며, 동의서/계약 관리가 체계적이지 않음 |
| **Solution** | 티저 페이지 → 신청 모달 → 어드민 세팅 → 동의서 서명 → PDF 생성의 자동화 파이프라인 구축 |
| **Function UX Effect** | 강사는 웹에서 프로그램 확인 후 바로 신청, 동의서 링크로 간편 서명. 어드민은 대시보드에서 전체 현황 관리 |
| **Core Value** | 강사 섭외~동의서 완료까지의 전 과정 디지털 자동화로 운영 효율 극대화 |

---

## 1. 프로젝트 개요

리걸크루 변호사 실전 압축 부트캠프(The Rookie Camp)의 강사(리걸 커리어 멘토) 섭외 및 동의서 관리 시스템.

- **플랫폼**: Netlify 서버리스
- **스택**: Next.js 15 (App Router) + Drizzle ORM + Netlify DB (Neon PostgreSQL)
- **주요 기능**: 티저 페이지, 멘토 신청, 어드민 관리, 동의서 서명, PDF 생성, 이메일 발송

---

## 2. 구현 Phase 계획

### Phase 1: 프로젝트 셋업 + 티저 페이지 (우선순위: 높음)

**목표**: Next.js 프로젝트 초기화, DB 스키마 생성, 티저 페이지 구현

| 작업 | 상세 |
|------|------|
| Git 초기화 | `git init`, `.gitignore` 설정 |
| Next.js 15 프로젝트 생성 | App Router, Tailwind CSS |
| Netlify DB 연결 | `@netlify/neon` + Drizzle ORM 설정 |
| DB 스키마 정의 | 4개 테이블 (instructors, consent_settings, consent_signatures, notices) |
| 티저 페이지 구현 | `prototype/teaser_prototype_v7.html` → Next.js 컴포넌트 변환 |
| 커리큘럼 데이터 | `src/data/curriculum.ts`에 24강 데이터 분리 |

**산출물**:
- 작동하는 티저 페이지 (`/`)
- DB 스키마 마이그레이션 완료

---

### Phase 2: 멘토 신청 모달 + API (우선순위: 높음)

**목표**: 신청 폼 모달 UI + 데이터 저장 API

| 작업 | 상세 |
|------|------|
| ApplyModal 컴포넌트 | 모달 팝업, 폼 필드 (프로토타입 기반) |
| 폼 유효성 검증 | 주민번호 형식, 이메일, 전화번호 등 |
| `POST /api/apply` | 신청 데이터 저장, 주민번호/계좌번호 AES-256 암호화 |
| 암호화 모듈 | `src/lib/encrypt.ts` (AES-256-GCM) |
| Rate limiting | IP/이메일 중복 방지 |

**산출물**:
- 신청 모달 작동 (UI + API)
- 암호화된 데이터 DB 저장 확인

---

### Phase 3: 어드민 페이지 (우선순위: 높음)

**목표**: 어드민 인증 + 강사 관리 + 동의서 세팅/발송

| 작업 | 상세 |
|------|------|
| 어드민 로그인 | 비밀번호 + JWT 세션 |
| 대시보드 | 신청/발송/완료 현황 카운트 |
| 강사 목록 | 상태별 필터, 기본정보 확인 (민감정보 마스킹) |
| 동의서 세팅 | 강의주제/강사료/특약 입력 폼 |
| 동의서 링크 발송 | UUID v4 토큰 생성, 상태 업데이트 |

**산출물**:
- 어드민 로그인/대시보드
- 강사 목록 조회 + 동의서 세팅

---

### Phase 4: 동의서 서명 페이지 (우선순위: 높음)

**목표**: 강사가 동의서를 확인하고 서명하는 페이지

| 작업 | 상세 |
|------|------|
| `GET /api/consent/{token}` | 토큰으로 동의서 데이터 조회 |
| ConsentForm 컴포넌트 | 강의조건 표시 + 체크박스 + 서명 입력 |
| `POST /api/consent/{token}` | 서명 데이터 저장, 토큰 비활성화 |
| 이름 일치 검증 | 서명 이름 = 신청 시 이름 확인 |

**산출물**:
- 동의서 서명 페이지 (`/consent/{token}`)

---

### Phase 5: PDF 생성 + 다운로드 (우선순위: 높음)

**목표**: 동의서 서명 후 PDF 자동 생성 및 다운로드

| 작업 | 상세 |
|------|------|
| PDF 생성 모듈 | `pdf-lib`로 동의서 PDF 생성 (`src/lib/pdf.ts`) |
| PDF 내용 | 강사정보, 강의조건, 동의항목, 서명, 계좌정보, 문서번호 |
| Netlify Blobs 저장 | PDF 파일 저장 |
| 다운로드 API | `GET /api/consent/{token}/pdf`, `GET /api/admin/instructors/{id}/pdf` |

**산출물**:
- PDF 생성 + 다운로드 작동

---

### Phase 6: 이메일 발송 (우선순위: 중간)

**목표**: Resend API로 각 시점별 이메일 발송

| 작업 | 상세 |
|------|------|
| 이메일 모듈 | `src/lib/email.ts` (Resend) |
| 신청 접수 알림 | 어드민에게 새 신청 알림 |
| 동의서 링크 발송 | 강사에게 서명 링크 이메일 |
| 서명 완료 알림 | 어드민에게 서명 완료 알림 |

**산출물**:
- 4가지 이메일 시나리오 작동

---

### Phase 7: 공지 기능 (우선순위: 중간)

**목표**: 어드민이 강사에게 공지 이메일 발송

| 작업 | 상세 |
|------|------|
| 공지 작성 UI | 제목/본문 입력 + 대상 선택 (전체/동의완료만) |
| `POST /api/admin/notices` | 공지 저장 + 이메일 발송 |
| 공지 이력 | 발송 이력 조회 |

**산출물**:
- 공지 작성/발송/이력 조회

---

### Phase 8: UI 다듬기 + 모바일 (우선순위: 낮음)

**목표**: 전체 UI 품질 향상 및 모바일 반응형 최적화

| 작업 | 상세 |
|------|------|
| 반응형 점검 | 모든 페이지 모바일 최적화 |
| 로딩/에러 상태 | 스켈레톤 UI, 에러 화면 |
| 접근성 | 키보드 네비게이션, ARIA |
| 최종 점검 | 전체 플로우 E2E 테스트 |

**산출물**:
- 모바일 대응 완료
- 전체 시스템 정상 작동

---

## 3. 기술 스택 상세

| 영역 | 기술 | 용도 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | SSR/SSG + API Routes |
| DB | Netlify DB (Neon PostgreSQL) | 데이터 저장 |
| ORM | Drizzle ORM | 타입 안전 쿼리 |
| 암호화 | Node.js crypto (AES-256-GCM) | 주민번호, 계좌번호 암호화 |
| PDF | pdf-lib | 서버리스 환경 PDF 생성 |
| 이메일 | Resend | 이메일 발송 (무료 100통/일) |
| 파일저장 | Netlify Blobs | PDF 저장 |
| 스타일 | Tailwind CSS | 유틸리티 CSS |
| 인증 | JWT (jose) | 어드민 세션 |
| 배포 | Netlify | Git 자동배포 |

---

## 4. DB 테이블 (4개)

- **instructors**: 강사 기본정보 + 상태관리
- **consent_settings**: 어드민이 세팅한 동의서 조건 + 토큰
- **consent_signatures**: 강사 서명 데이터 + PDF 경로
- **notices**: 공지 이력

---

## 5. 보안 요구사항

| 항목 | 방안 |
|------|------|
| 주민번호/계좌번호 | AES-256-GCM 암호화, 환경변수로 키 관리 |
| 어드민 | 비밀번호 bcrypt 해싱 + JWT |
| 동의서 토큰 | UUID v4, 서명 후 비활성화 |
| HTTPS | Netlify SSL 기본 제공 |
| Rate Limiting | 신청 폼 IP/이메일 중복 방지 |

---

## 6. 리스크 및 대응

| 리스크 | 대응 |
|--------|------|
| Netlify Functions 10초 제한 | PDF 생성 최적화 (pdf-lib 경량) |
| Resend 무료 100통/일 제한 | 공지 발송 시 대량 발송 주의, 배치 처리 |
| 한글 PDF 폰트 | pdf-lib에 NotoSansKR 폰트 임베딩 |
| Netlify DB cold start | 커넥션 풀링 설정 |

---

## 7. 구현 시작 기준

Phase 1부터 순차적으로 진행. 각 Phase 완료 후 git commit.
Phase 1~5가 핵심 기능(MVP), Phase 6~8이 부가 기능.
