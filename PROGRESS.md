### 2026-03-19 세션

**완료:**
- 신청 모달에 프로그램 기본 정보 섹션 추가 (프로그램명, 연수기간, 교육시간, 강의방식, 장소, 문의처)
- instructors 테이블에 program_name 컬럼 추가
- API에서 programName 필드 수신/저장 처리
- drizzle.config.ts 설정 파일 추가

**미완료/이슈:**
- 없음

**다음 작업:**
- DB 마이그레이션 실행 (program_name 컬럼 반영)
- 추가 기능 요청에 따라 진행

**변경된 파일:**
- src/lib/schema.ts (program_name 컬럼 추가)
- src/components/ApplyModal.tsx (프로그램 정보 섹션 UI 추가, programName 전송)
- src/app/api/apply/route.ts (programName 수신/저장)
- drizzle.config.ts (Drizzle ORM 설정 파일 신규)
