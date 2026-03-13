# Design: LegalCrew Academy 강사섭외 시스템

> Feature: legalcrew-academy
> Created: 2026-03-13
> Status: Design
> Plan Reference: docs/01-plan/features/legalcrew-academy.plan.md

---

## 1. 디렉토리 구조

```
/
├── CLAUDE.md
├── SPEC_v2.0_FINAL.md
├── prototype/
│   └── teaser_prototype_v7.html
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── page.tsx                      # 티저 페이지 (/)
│   │   ├── globals.css                   # Tailwind + 커스텀 CSS 변수
│   │   ├── consent/
│   │   │   └── [token]/
│   │   │       └── page.tsx              # 동의서 서명 페이지
│   │   ├── admin/
│   │   │   ├── layout.tsx                # 어드민 레이아웃 (인증 체크)
│   │   │   ├── page.tsx                  # 대시보드
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # 로그인 페이지
│   │   │   ├── instructors/
│   │   │   │   ├── page.tsx              # 강사 목록
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx          # 강사 상세 + 동의서 세팅
│   │   │   └── notices/
│   │   │       └── page.tsx              # 공지 관리
│   │   └── api/
│   │       ├── apply/
│   │       │   └── route.ts              # POST: 멘토 신청
│   │       ├── consent/
│   │       │   └── [token]/
│   │       │       ├── route.ts          # GET: 동의서 데이터, POST: 서명 제출
│   │       │       └── pdf/
│   │       │           └── route.ts      # GET: PDF 다운로드
│   │       └── admin/
│   │           ├── auth/
│   │           │   └── route.ts          # POST: 로그인
│   │           ├── dashboard/
│   │           │   └── route.ts          # GET: 대시보드 데이터
│   │           ├── instructors/
│   │           │   ├── route.ts          # GET: 강사 목록
│   │           │   └── [id]/
│   │           │       ├── route.ts      # GET: 강사 상세
│   │           │       ├── consent/
│   │           │       │   └── route.ts  # POST: 동의서 세팅 + 발송
│   │           │       └── pdf/
│   │           │           └── route.ts  # GET: PDF 다운로드
│   │           └── notices/
│   │               └── route.ts          # POST: 공지 작성, GET: 공지 이력
│   ├── components/
│   │   ├── teaser/
│   │   │   ├── Nav.tsx                   # 고정 네비게이션
│   │   │   ├── Hero.tsx                  # 히어로 섹션
│   │   │   ├── StorySection.tsx          # 스토리텔링 섹션 (재사용)
│   │   │   ├── Overview.tsx              # 프로그램 개요 스트립
│   │   │   ├── Mission.tsx               # 미션 카드
│   │   │   ├── Curriculum.tsx            # 커리큘럼 (PC 테이블 + 모바일 아코디언)
│   │   │   ├── FAQ.tsx                   # FAQ 아코디언
│   │   │   ├── FooterCTA.tsx             # 하단 CTA
│   │   │   └── Footer.tsx                # 푸터
│   │   ├── ApplyModal.tsx                # 멘토 신청 모달
│   │   └── ConsentForm.tsx               # 동의서 서명 폼
│   ├── lib/
│   │   ├── db.ts                         # Drizzle + Neon 연결
│   │   ├── schema.ts                     # DB 스키마 (Drizzle)
│   │   ├── encrypt.ts                    # AES-256-GCM 암호화/복호화
│   │   ├── pdf.ts                        # PDF 생성 (pdf-lib)
│   │   ├── email.ts                      # Resend 이메일 발송
│   │   └── auth.ts                       # JWT 생성/검증 (jose)
│   └── data/
│       └── curriculum.ts                 # 24강 커리큘럼 데이터
├── public/
│   └── fonts/
│       └── NotoSansKR-Regular.ttf        # PDF용 한글 폰트
├── drizzle.config.ts                     # Drizzle 설정
├── netlify.toml                          # Netlify 설정
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── .env.local                            # 환경변수 (로컬용)
```

---

## 2. DB 스키마 (Drizzle ORM)

### 2.1 schema.ts 설계

```typescript
// src/lib/schema.ts
import { pgTable, uuid, varchar, text, boolean, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const barExamTypeEnum = pgEnum('bar_exam_type', ['judicial_exam', 'bar_exam']);
export const instructorStatusEnum = pgEnum('instructor_status', ['applied', 'consent_sent', 'consented']);
export const noticeTargetEnum = pgEnum('notice_target', ['all', 'consented_only']);

// instructors
export const instructors = pgTable('instructors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  residentNumber: varchar('resident_number', { length: 255 }).notNull(),   // AES-256 암호화
  barExamType: barExamTypeEnum('bar_exam_type').notNull(),
  barExamDetail: varchar('bar_exam_detail', { length: 100 }).notNull(),
  bio: text('bio').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  bankName: varchar('bank_name', { length: 30 }).notNull(),
  accountNumber: varchar('account_number', { length: 255 }).notNull(),     // AES-256 암호화
  accountHolder: varchar('account_holder', { length: 50 }).notNull(),
  parkingNeeded: boolean('parking_needed').notNull().default(false),
  carNumber: varchar('car_number', { length: 20 }),
  status: instructorStatusEnum('status').notNull().default('applied'),
  appliedAt: timestamp('applied_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// consent_settings
export const consentSettings = pgTable('consent_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  instructorId: uuid('instructor_id').notNull().references(() => instructors.id),
  lectureTopic: varchar('lecture_topic', { length: 200 }).notNull(),
  feeAmount: integer('fee_amount').notNull(),                               // 원 단위
  specialTerms: text('special_terms'),
  token: varchar('token', { length: 36 }).notNull().unique(),               // UUID v4
  sentAt: timestamp('sent_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// consent_signatures
export const consentSignatures = pgTable('consent_signatures', {
  id: uuid('id').defaultRandom().primaryKey(),
  instructorId: uuid('instructor_id').notNull().references(() => instructors.id),
  consentSettingId: uuid('consent_setting_id').notNull().references(() => consentSettings.id),
  topicConfirmed: boolean('topic_confirmed').notNull(),
  feeAgreed: boolean('fee_agreed').notNull(),
  privacyAgreed: boolean('privacy_agreed').notNull(),
  residentIdAgreed: boolean('resident_id_agreed').notNull(),
  portraitAgreed: boolean('portrait_agreed').notNull().default(false),       // 선택
  signedName: varchar('signed_name', { length: 50 }).notNull(),
  signedAt: timestamp('signed_at').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }).notNull(),
  pdfUrl: text('pdf_url'),
});

// notices
export const notices = pgTable('notices', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  body: text('body').notNull(),
  target: noticeTargetEnum('target').notNull(),
  sentCount: integer('sent_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
```

---

## 3. API 상세 설계

### 3.1 공개 API

#### POST /api/apply

```
Request Body:
{
  name: string,
  residentNumber: string,        // "000000-0000000"
  barExamType: "judicial_exam" | "bar_exam",
  barExamDetail: string,
  bio: string,
  phone: string,
  email: string,
  bankName: string,
  accountNumber: string,
  accountHolder: string,
  parkingNeeded: boolean,
  carNumber?: string,            // parkingNeeded === true일 때만
  privacyAgreed: boolean,
  residentIdAgreed: boolean,
  promotionAgreed: boolean
}

Response 201:
{ success: true, message: "신청이 접수되었습니다." }

Response 400: 유효성 검증 실패
Response 409: 이메일 중복 신청
Response 429: Rate limit 초과

로직:
1. 입력값 유효성 검증 (주민번호 형식, 이메일 형식, 필수값)
2. 이메일 중복 체크
3. residentNumber, accountNumber → AES-256-GCM 암호화
4. instructors 테이블 INSERT (status: 'applied')
5. 어드민에게 신규 신청 알림 이메일 발송 (비동기)
```

#### GET /api/consent/[token]

```
Response 200:
{
  instructor: { name: string },
  setting: {
    lectureTopic: string,
    feeAmount: number,
    specialTerms: string | null
  },
  alreadySigned: boolean          // 서명 완료 여부
}

Response 404: 유효하지 않은 토큰

로직:
1. token으로 consent_settings 조회
2. instructor_id로 instructors.name 조회
3. consent_signatures 존재 여부로 alreadySigned 판단
```

#### POST /api/consent/[token]

```
Request Body:
{
  topicConfirmed: boolean,
  feeAgreed: boolean,
  privacyAgreed: boolean,
  residentIdAgreed: boolean,
  portraitAgreed: boolean,
  signedName: string
}

Response 201:
{ success: true, pdfUrl: string }

Response 400: 필수 동의 미체크 또는 이름 불일치
Response 404: 유효하지 않은 토큰
Response 409: 이미 서명 완료

로직:
1. token 유효성 + 미서명 확인
2. signedName === instructors.name 확인
3. consent_signatures INSERT
4. instructors.status → 'consented' 업데이트
5. PDF 생성 → Netlify Blobs 저장
6. consent_signatures.pdf_url 업데이트
7. 어드민에게 서명 완료 알림 이메일 (비동기)
```

#### GET /api/consent/[token]/pdf

```
Response 200: PDF 파일 (Content-Type: application/pdf)
Response 404: 토큰 또는 PDF 없음

로직:
1. token → consent_settings → consent_signatures 조회
2. Netlify Blobs에서 PDF 읽기
3. PDF 스트림 응답
```

### 3.2 어드민 API

#### POST /api/admin/auth

```
Request Body: { password: string }
Response 200: { token: string }   // JWT (24시간)
Response 401: 비밀번호 불일치

로직:
1. 환경변수 ADMIN_PASSWORD_HASH와 bcrypt 비교
2. jose로 JWT 생성 (exp: 24h)
```

#### GET /api/admin/dashboard

```
Headers: Authorization: Bearer {jwt}
Response 200:
{
  applied: number,
  consentSent: number,
  consented: number
}
```

#### GET /api/admin/instructors

```
Headers: Authorization: Bearer {jwt}
Query: ?status=applied|consent_sent|consented
Response 200:
{
  instructors: [{
    id, name, email, phone, barExamType, barExamDetail,
    status, appliedAt
  }]
}
// 민감정보(주민번호, 계좌번호) 미포함
```

#### GET /api/admin/instructors/[id]

```
Headers: Authorization: Bearer {jwt}
Response 200:
{
  instructor: {
    id, name, email, phone, barExamType, barExamDetail,
    bio, bankName, accountHolder, parkingNeeded, carNumber,
    residentNumber: "******-*******",    // 마스킹
    accountNumber: "***-****-***-**",    // 마스킹
    status, appliedAt
  },
  consentSetting: { ... } | null,
  consentSignature: { ... } | null
}
```

#### POST /api/admin/instructors/[id]/consent

```
Headers: Authorization: Bearer {jwt}
Request Body:
{
  lectureTopic: string,
  feeAmount: number,
  specialTerms?: string
}

Response 201:
{ success: true, token: string }

로직:
1. UUID v4 토큰 생성
2. consent_settings INSERT
3. instructors.status → 'consent_sent' 업데이트
4. 강사에게 동의서 링크 이메일 발송
```

#### POST /api/admin/notices

```
Headers: Authorization: Bearer {jwt}
Request Body:
{
  title: string,
  body: string,
  target: "all" | "consented_only"
}

Response 201:
{ success: true, sentCount: number }

로직:
1. target에 따라 대상 강사 이메일 목록 조회
2. notices INSERT
3. Resend로 이메일 발송 (배치)
4. sentCount 업데이트
```

---

## 4. 컴포넌트 설계

### 4.1 티저 페이지 컴포넌트

| 컴포넌트 | Props | 설명 |
|----------|-------|------|
| `Nav` | `onApplyClick: () => void` | 고정 네비, 스크롤 시 배경 변경 |
| `Hero` | - | 히어로 (다크), 배지 + h1 + 부제 |
| `StorySection` | `theme: 'dark' \| 'light'`, `children` | 스크롤 reveal 스토리 |
| `Overview` | - | 프로그램 개요 5항목 그리드 (라이트) |
| `Mission` | - | 미션 3카드 가로 배치 (다크) |
| `Curriculum` | - | PC: 테이블, 모바일: 아코디언 (다크) |
| `FAQ` | - | 3개 FAQ + 문의처 (다크) |
| `FooterCTA` | `onApplyClick: () => void` | 하단 CTA (라이트) |
| `Footer` | - | 저작권 |

### 4.2 ApplyModal

```
State:
- isOpen: boolean
- step: 'form' | 'success'
- isSubmitting: boolean
- errors: Record<string, string>

주요 로직:
- ESC/바깥 클릭으로 닫기
- 폼 유효성 검증 (클라이언트)
- barExamType 선택 시 조건부 필드 표시
- parkingNeeded 선택 시 차량번호 필드 표시
- 제출 → POST /api/apply → 성공 화면
```

### 4.3 ConsentForm

```
Props:
- instructor: { name: string }
- setting: { lectureTopic, feeAmount, specialTerms }

State:
- checkboxes (5개)
- signedName: string
- isSubmitting: boolean

주요 로직:
- 모든 필수 체크 + 이름 입력 시에만 서명 버튼 활성화
- 제출 → POST /api/consent/{token} → PDF 다운로드 링크 표시
- 이미 서명된 경우: 서명 완료 표시 + PDF 다운로드만 가능
```

---

## 5. 핵심 모듈 설계

### 5.1 encrypt.ts

```typescript
// AES-256-GCM
// 환경변수: ENCRYPTION_KEY (32바이트 hex)

encrypt(plainText: string): string
// → iv(12bytes) + authTag(16bytes) + cipherText → base64 인코딩

decrypt(encrypted: string): string
// → base64 디코딩 → iv/authTag/cipherText 분리 → 복호화

maskResident(encrypted: string): string
// → "******-*******"

maskAccount(encrypted: string): string
// → 복호화 후 중간 마스킹 "***-****-***-**"
```

### 5.2 auth.ts

```typescript
// 환경변수: ADMIN_PASSWORD_HASH (bcrypt), JWT_SECRET

verifyPassword(password: string): Promise<boolean>
// → bcrypt.compare(password, ADMIN_PASSWORD_HASH)

createToken(): Promise<string>
// → jose SignJWT, exp: 24h

verifyToken(token: string): Promise<boolean>
// → jose jwtVerify

getTokenFromRequest(req: NextRequest): string | null
// → Authorization: Bearer {token} 파싱
```

### 5.3 pdf.ts

```typescript
// pdf-lib + NotoSansKR 폰트 임베딩

generateConsentPdf(data: {
  instructor: { name, phone, email, bankName, accountNumber, accountHolder, parkingNeeded, carNumber },
  setting: { lectureTopic, feeAmount, specialTerms },
  signature: { topicConfirmed, feeAgreed, privacyAgreed, residentIdAgreed, portraitAgreed, signedName, signedAt },
  documentId: string
}): Promise<Uint8Array>

// PDF 내용:
// - 제목: "리걸크루 변호사 실전 압축 부트캠프 — 강의 동의서"
// - 강사 정보 섹션
// - 강의 조건 섹션
// - 특약사항 (있으면)
// - 동의 항목 체크 표시
// - 서명 이름 + 서명 일시
// - 계좌 정보
// - 주차 정보
// - 하단: 문서번호 + 생성일시
```

### 5.4 email.ts

```typescript
// 환경변수: RESEND_API_KEY, EMAIL_FROM

sendApplyNotification(instructor: { name, email }): Promise<void>
// → 어드민(cs@legalcrew.co.kr)에게 새 신청 알림

sendConsentLink(to: string, name: string, token: string): Promise<void>
// → 강사에게 동의서 링크 이메일

sendConsentComplete(instructor: { name }): Promise<void>
// → 어드민에게 서명 완료 알림

sendNotice(to: string[], title: string, body: string): Promise<void>
// → 대상 강사들에게 공지 이메일 (배치)
```

---

## 6. 환경변수

```env
# DB
DATABASE_URL=postgresql://...

# 암호화
ENCRYPTION_KEY=<64자 hex string (32바이트)>

# 어드민
ADMIN_PASSWORD_HASH=<bcrypt hash>
JWT_SECRET=<랜덤 문자열>

# 이메일
RESEND_API_KEY=re_...
EMAIL_FROM=LegalCrew Academy <noreply@legalcrew.co.kr>

# URL
NEXT_PUBLIC_BASE_URL=https://...netlify.app
```

---

## 7. 디자인 토큰 (Tailwind 확장)

```typescript
// tailwind.config.ts colors 확장
{
  ink: { DEFAULT: '#0f0f1e', mid: '#1a1a2e', light: '#2a2a44' },
  cream: { DEFAULT: '#faf8f5', dim: 'rgba(250,248,245,0.5)', faint: 'rgba(250,248,245,0.2)' },
  gold: { DEFAULT: '#c4993c', light: '#e8d5a3', dark: '#a07d2e', faint: 'rgba(196,153,60,0.15)' },
  muted: '#6b6b8a',
}

// fontFamily 확장
{
  logo: ['Cormorant Garamond', 'serif'],
  heading: ['Noto Serif KR', 'serif'],
  body: ['Noto Sans KR', 'sans-serif'],
  number: ['Playfair Display', 'serif'],
}
```

---

## 8. 구현 순서 (Phase별 파일)

### Phase 1: 셋업 + 티저

```
생성 파일:
├── package.json (next, drizzle, @netlify/neon, tailwind)
├── next.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
├── netlify.toml
├── .gitignore
├── .env.local
├── src/app/layout.tsx
├── src/app/globals.css
├── src/app/page.tsx
├── src/lib/db.ts
├── src/lib/schema.ts
├── src/data/curriculum.ts
├── src/components/teaser/Nav.tsx
├── src/components/teaser/Hero.tsx
├── src/components/teaser/StorySection.tsx
├── src/components/teaser/Overview.tsx
├── src/components/teaser/Mission.tsx
├── src/components/teaser/Curriculum.tsx
├── src/components/teaser/FAQ.tsx
├── src/components/teaser/FooterCTA.tsx
└── src/components/teaser/Footer.tsx
```

### Phase 2: 신청 모달

```
생성 파일:
├── src/components/ApplyModal.tsx
├── src/lib/encrypt.ts
└── src/app/api/apply/route.ts
```

### Phase 3: 어드민

```
생성 파일:
├── src/lib/auth.ts
├── src/app/admin/layout.tsx
├── src/app/admin/login/page.tsx
├── src/app/admin/page.tsx
├── src/app/admin/instructors/page.tsx
├── src/app/admin/instructors/[id]/page.tsx
├── src/app/admin/notices/page.tsx
├── src/app/api/admin/auth/route.ts
├── src/app/api/admin/dashboard/route.ts
├── src/app/api/admin/instructors/route.ts
├── src/app/api/admin/instructors/[id]/route.ts
├── src/app/api/admin/instructors/[id]/consent/route.ts
└── src/app/api/admin/notices/route.ts
```

### Phase 4: 동의서

```
생성 파일:
├── src/app/consent/[token]/page.tsx
├── src/components/ConsentForm.tsx
└── src/app/api/consent/[token]/route.ts
```

### Phase 5: PDF

```
생성 파일:
├── src/lib/pdf.ts
├── public/fonts/NotoSansKR-Regular.ttf
├── src/app/api/consent/[token]/pdf/route.ts
└── src/app/api/admin/instructors/[id]/pdf/route.ts
```

### Phase 6: 이메일

```
생성 파일:
└── src/lib/email.ts
(+ 기존 API route들에 이메일 발송 로직 추가)
```

### Phase 7: 공지

```
(Phase 3에서 이미 파일 생성, 이메일 연동만 추가)
```

### Phase 8: UI 다듬기

```
(기존 파일 수정 위주)
```

---

## 9. 의존성 패키지

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@netlify/neon": "latest",
    "drizzle-orm": "latest",
    "pdf-lib": "^1.17",
    "resend": "^4",
    "jose": "^5",
    "bcryptjs": "^2.4",
    "uuid": "^10"
  },
  "devDependencies": {
    "drizzle-kit": "latest",
    "typescript": "^5",
    "@types/react": "^19",
    "@types/node": "^22",
    "@types/bcryptjs": "^2.4",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "latest",
    "postcss": "latest"
  }
}
```
