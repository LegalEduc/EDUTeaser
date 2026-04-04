-- 어드민 강사 목록/상세가 비어 보이거나 500이 나는 경우,
-- 스키마에만 있고 DB에는 없는 fee_limit_check_needed 를 추가합니다.
-- Neon / Netlify DB 콘솔 또는 psql에서 실행 후 배포를 다시 확인하세요.

ALTER TABLE instructors
ADD COLUMN IF NOT EXISTS fee_limit_check_needed boolean;
