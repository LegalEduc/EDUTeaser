-- 실행 전 백업 권장.
-- 공문/한도 섹션에 아무 입력도 없는 행(출강공문 미응답·한도 미입력)만
-- fee_limit_check_needed 를 false(불필요)로 채웁니다.
-- 출강공문이나 한도를 적은 사람은 제외되며, 그 경우 NULL이면 어드민에서 수동 보정하세요.

BEGIN;

UPDATE instructors
SET fee_limit_check_needed = false
WHERE fee_limit_check_needed IS NULL
  AND fee_doc_needed IS NULL
  AND (fee_limit IS NULL OR btrim(fee_limit) = '');

COMMIT;
