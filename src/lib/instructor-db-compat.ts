import { instructors, consentSettings, consentSignatures } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

/** DB에 fee_limit_check_needed 가 없을 때(스키마 반영 전) PostgreSQL 오류 */
export function isMissingFeeLimitCheckColumnError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes("fee_limit_check_needed") &&
    (msg.includes("does not exist") || msg.includes("42703"))
  );
}

/** 강사 상세 등 단일 행 — 한도공문 컬럼 제외(구 DB) */
export const instructorSelectWithoutFeeLimitCheck = {
  id: instructors.id,
  programName: instructors.programName,
  name: instructors.name,
  residentNumber: instructors.residentNumber,
  barExamType: instructors.barExamType,
  barExamDetail: instructors.barExamDetail,
  bio: instructors.bio,
  phone: instructors.phone,
  email: instructors.email,
  bankName: instructors.bankName,
  accountNumber: instructors.accountNumber,
  accountHolder: instructors.accountHolder,
  parkingNeeded: instructors.parkingNeeded,
  carNumber: instructors.carNumber,
  feeLimit: instructors.feeLimit,
  feeDocNeeded: instructors.feeDocNeeded,
  status: instructors.status,
  appliedAt: instructors.appliedAt,
  createdAt: instructors.createdAt,
} as const;

/** 목록 조인 조회 — 전체 컬럼 */
export const instructorsListSelectFull = {
  id: instructors.id,
  name: instructors.name,
  email: instructors.email,
  phone: instructors.phone,
  barExamType: instructors.barExamType,
  barExamDetail: instructors.barExamDetail,
  status: instructors.status,
  appliedAt: instructors.appliedAt,
  feeLimit: instructors.feeLimit,
  feeDocNeeded: instructors.feeDocNeeded,
  feeLimitCheckNeeded: instructors.feeLimitCheckNeeded,
  sentAt: consentSettings.sentAt,
  signedAt: consentSignatures.signedAt,
} as const;

/** 목록 조인 조회 — fee_limit_check_needed 제외 */
export const instructorsListSelectLegacy = {
  id: instructors.id,
  name: instructors.name,
  email: instructors.email,
  phone: instructors.phone,
  barExamType: instructors.barExamType,
  barExamDetail: instructors.barExamDetail,
  status: instructors.status,
  appliedAt: instructors.appliedAt,
  feeLimit: instructors.feeLimit,
  feeDocNeeded: instructors.feeDocNeeded,
  sentAt: consentSettings.sentAt,
  signedAt: consentSignatures.signedAt,
} as const;

/** 엑셀 export 조인 — 전체 */
export const instructorsExportJoinSelectFull = {
  id: instructors.id,
  name: instructors.name,
  email: instructors.email,
  phone: instructors.phone,
  residentNumberEnc: instructors.residentNumber,
  barExamType: instructors.barExamType,
  barExamDetail: instructors.barExamDetail,
  bio: instructors.bio,
  bankName: instructors.bankName,
  accountNumberEnc: instructors.accountNumber,
  accountHolder: instructors.accountHolder,
  parkingNeeded: instructors.parkingNeeded,
  carNumber: instructors.carNumber,
  feeLimit: instructors.feeLimit,
  feeDocNeeded: instructors.feeDocNeeded,
  feeLimitCheckNeeded: instructors.feeLimitCheckNeeded,
  status: instructors.status,
  appliedAt: instructors.appliedAt,
  lectureTopic: consentSettings.lectureTopic,
  lectureCount: consentSettings.lectureCount,
  feeAmount: consentSettings.feeAmount,
  totalFee: consentSettings.totalFee,
  specialTerms: consentSettings.specialTerms,
  sentAt: consentSettings.sentAt,
  signedName: consentSignatures.signedName,
  signedAt: consentSignatures.signedAt,
} as const;

/** 엑셀 export 조인 — fee_limit_check_needed 제외 */
export const instructorsExportJoinSelectLegacy = {
  id: instructors.id,
  name: instructors.name,
  email: instructors.email,
  phone: instructors.phone,
  residentNumberEnc: instructors.residentNumber,
  barExamType: instructors.barExamType,
  barExamDetail: instructors.barExamDetail,
  bio: instructors.bio,
  bankName: instructors.bankName,
  accountNumberEnc: instructors.accountNumber,
  accountHolder: instructors.accountHolder,
  parkingNeeded: instructors.parkingNeeded,
  carNumber: instructors.carNumber,
  feeLimit: instructors.feeLimit,
  feeDocNeeded: instructors.feeDocNeeded,
  status: instructors.status,
  appliedAt: instructors.appliedAt,
  lectureTopic: consentSettings.lectureTopic,
  lectureCount: consentSettings.lectureCount,
  feeAmount: consentSettings.feeAmount,
  totalFee: consentSettings.totalFee,
  specialTerms: consentSettings.specialTerms,
  sentAt: consentSettings.sentAt,
  signedName: consentSignatures.signedName,
  signedAt: consentSignatures.signedAt,
} as const;
