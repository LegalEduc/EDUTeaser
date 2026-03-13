# LegalCrew Academy — 강사섭외 시스템

## 프로젝트 요약

리걸크루 변호사 실전 압축 부트캠프(The Rookie Camp)의 강사(리걸 커리어 멘토) 섭외 및 동의서 관리 시스템.
Netlify 서버리스 환경에서 운영.

## 핵심 흐름

1. **티저 페이지** → 강사가 프로그램 확인
2. **멘토 신청 모달** → 기본정보 입력 + 제출 (모달 팝업)
3. **어드민** → 신청 확인 → 강의주제/강사료/특약 세팅 → 동의서 링크 이메일 발송
4. **동의서 서명** → 강사가 링크 클릭 → 조건 확인 + 서명 → PDF 생성/다운로드

## 스택

- **프레임워크**: Next.js 15 (App Router)
- **DB**: Netlify DB (Neon PostgreSQL) — `@netlify/neon` 패키지
- **ORM**: Drizzle ORM
- **PDF**: pdf-lib
- **이메일**: Resend
- **파일저장**: Netlify Blobs (PDF)
- **스타일**: Tailwind CSS
- **배포**: Netlify (Git 자동배포)

## 디렉토리 구조 (권장)

```
/
├── CLAUDE.md
├── SPEC.md                      # 전체 스펙 문서 (v2.0)
├── prototype/
│   └── teaser_prototype_v7.html # 티저 페이지 디자인 프로토타입
├── src/
│   ├── app/
│   │   ├── page.tsx             # 티저 페이지 (/)
│   │   ├── consent/
│   │   │   └── [token]/
│   │   │       └── page.tsx     # 동의서 서명 페이지
│   │   ├── admin/
│   │   │   ├── page.tsx         # 어드민 대시보드
│   │   │   ├── instructors/
│   │   │   │   └── page.tsx     # 강사 관리
│   │   │   └── notices/
│   │   │       └── page.tsx     # 공지 관리
│   │   └── api/
│   │       ├── apply/
│   │       │   └── route.ts     # POST: 참여 신청
│   │       ├── consent/
│   │       │   └── [token]/
│   │       │       ├── route.ts # GET: 동의서 데이터, POST: 서명 제출
│   │       │       └── pdf/
│   │       │           └── route.ts # GET: PDF 다운로드
│   │       └── admin/
│   │           ├── auth/
│   │           │   └── route.ts
│   │           ├── dashboard/
│   │           │   └── route.ts
│   │           ├── instructors/
│   │           │   └── route.ts
│   │           └── notices/
│   │               └── route.ts
│   ├── components/
│   │   ├── ApplyModal.tsx       # 신청 모달 컴포넌트
│   │   ├── CurriculumTable.tsx  # 커리큘럼 테이블/아코디언
│   │   └── ConsentForm.tsx      # 동의서 서명 폼
│   ├── lib/
│   │   ├── db.ts               # Drizzle + Neon 연결
│   │   ├── schema.ts           # DB 스키마 정의
│   │   ├── encrypt.ts          # AES-256 암호화/복호화 (주민번호, 계좌)
│   │   ├── pdf.ts              # PDF 생성 로직
│   │   └── email.ts            # Resend 이메일 발송
│   └── data/
│       └── curriculum.ts        # 24강 커리큘럼 데이터
├── netlify.toml
├── drizzle.config.ts
└── package.json
```

## DB 테이블 (4개)

### instructors
- id (UUID PK), name, resident_number (암호화), bar_exam_type (enum: judicial_exam/bar_exam), bar_exam_detail, bio (TEXT), phone, email, bank_name, account_number (암호화), account_holder, parking_needed (BOOLEAN), car_number (nullable), status (enum: applied/consent_sent/consented), applied_at, created_at

### consent_settings
- id (UUID PK), instructor_id (FK), lecture_topic, fee_amount (INTEGER, 원), special_terms (nullable), token (UNIQUE, UUID v4), sent_at, created_at

### consent_signatures
- id (UUID PK), instructor_id (FK), consent_setting_id (FK), topic_confirmed, fee_agreed, privacy_agreed, resident_id_agreed, portrait_agreed, signed_name, signed_at, ip_address, pdf_url

### notices
- id (UUID PK), title, body (TEXT), target (enum: all/consented_only), sent_count, created_at

## API 엔드포인트

**공개**
- `POST /api/apply` — 참여 신청
- `GET /api/consent/{token}` — 동의서 페이지 데이터
- `POST /api/consent/{token}` — 동의서 서명 제출
- `GET /api/consent/{token}/pdf` — PDF 다운로드

**어드민 (JWT 인증)**
- `POST /api/admin/auth` — 로그인
- `GET /api/admin/dashboard` — 대시보드
- `GET /api/admin/instructors` — 강사 목록
- `GET /api/admin/instructors/{id}` — 강사 상세
- `POST /api/admin/instructors/{id}/consent` — 동의서 세팅 + 발송
- `GET /api/admin/instructors/{id}/pdf` — PDF 다운로드
- `POST /api/admin/notices` — 공지 작성 + 발송
- `GET /api/admin/notices` — 공지 이력

## 보안 규칙 (필수)

- **주민등록번호, 계좌번호**: AES-256 암호화 저장. 어드민 조회 시 마스킹.
- **동의서 토큰**: UUID v4. 서명 완료 후 비활성화 (PDF 다운만 가능).
- **어드민**: 비밀번호 + JWT 세션.
- **신청 폼**: rate limiting (IP/이메일 중복 방지).

## 티저 페이지 디자인 가이드

- **프로토타입 파일**: `prototype/teaser_prototype_v7.html` 참조
- **디자인 레퍼런스**: cosmos.so 스타일 (스크롤 스토리텔링, 대형 타이포그래피, 미니멀)
- **색상**: 다크(#0f0f1e) + 크림(#faf8f5) + 골드(#c4993c) 교차
- **로고**: "LegalCrew Academy" (Cormorant Garamond, Academy는 이탤릭)
- **폰트**: Noto Serif KR (제목), Noto Sans KR (본문), Playfair Display (숫자), Cormorant Garamond (로고)
- **CTA 버튼**: border-radius 100px (라운드)
- **신청 폼**: 모달 팝업 (페이지 본문에 노출하지 않음)
- **명칭**: 강사를 "마스터"가 아닌 "멘토"로 호칭

### 다크/라이트 교차 배치

```
히어로       → 다크
스토리1      → 다크
스토리2      → 라이트
스토리3      → 라이트
프로그램개요  → 라이트
미션         → 다크
커리큘럼     → 다크
FAQ          → 다크
하단CTA      → 라이트
```

## 구현 순서

1. Netlify 프로젝트 셋업 + `npx netlify db init` + 스키마
2. 티저 페이지 (프로토타입 HTML → Next.js 변환)
3. 신청 모달 + `POST /api/apply`
4. 어드민 페이지 (신청 목록 + 동의서 세팅 + 발송)
5. 동의서 서명 페이지 + 서명 제출
6. PDF 생성 + 다운로드
7. 이메일 발송 (Resend)
8. 공지 기능
9. UI 다듬기 + 모바일

## 문의처 정보

- 담당자: 강선민 이사
- 이메일: cs@legalcrew.co.kr
- 전화: 010-0000-0000
