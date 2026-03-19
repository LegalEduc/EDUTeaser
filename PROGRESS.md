### 2026-03-19 세션 #3

**완료:**
- 동의 항목에 '내용보기' 팝업 추가 (개인정보 6항목, 홍보/자료제공 4항목)
- 첫번째 동의 → '개인정보 수집·이용 및 제3자 제공 동의'로 명칭 변경
- 두번째 동의 → '홍보 및 자료제공 활용 동의'로 명칭 변경
- 세번째 동의(이력 정보 활용) 삭제
- '강사료 및 정산 관련 확인' 섹션 추가 (선택사항)
- DB 스키마/API에 fee_limit, fee_doc_needed 반영

**미완료/이슈:**
- DB 마이그레이션 미실행 (program_name, fee_limit, fee_doc_needed 컬럼)

**다음 작업:**
- DB 마이그레이션 실행
- 추가 기능 요청에 따라 진행

**변경된 파일:**
- src/components/ApplyModal.tsx (동의 팝업, 강사료 섹션 추가)
- src/app/api/apply/route.ts (feeLimit, feeDocNeeded 수신/저장)
- src/lib/schema.ts (fee_limit, fee_doc_needed 컬럼 추가)

---

### 2026-03-19 세션 #2

**완료:**
- 모달 최대 너비 560px → 840px로 50% 확대
- 휴대폰/이메일을 기본 정보 섹션으로 이동, 연락처 섹션 삭제
- 사법시험 → '연수원 기수' 라벨, 플레이스홀더 '예시: 00기'
- 변호사시험 → 플레이스홀더 '예시: 00회'
- 기수/회차 입력 숫자 전용 + 토스트 메시지 '숫자만 입력해주세요'
- 은행명 드롭다운 → 텍스트 입력으로 변경
- 모달 외부 클릭 시 닫힘 방지 (X 버튼으로만 닫기)

**미완료/이슈:**
- 없음

**다음 작업:**
- DB 마이그레이션 실행 (program_name 컬럼 반영)
- 추가 기능 요청에 따라 진행

**변경된 파일:**
- src/components/ApplyModal.tsx (폼 구조 재배치, 입력 검증, 모달 크기/닫기 동작 변경)

---

### 2026-03-19 세션 #1

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
