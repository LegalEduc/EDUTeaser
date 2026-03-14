"use client";

import { useState, useEffect, FormEvent } from "react";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  residentNumber: string;
  barExamType: "" | "judicial_exam" | "bar_exam";
  barExamDetail: string;
  bio: string;
  phone: string;
  email: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  parkingNeeded: "" | "yes" | "no";
  carNumber: string;
  privacyAgreed: boolean;
  residentIdAgreed: boolean;
  promotionAgreed: boolean;
}

const initialForm: FormData = {
  name: "",
  residentNumber: "",
  barExamType: "",
  barExamDetail: "",
  bio: "",
  phone: "",
  email: "",
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  parkingNeeded: "",
  carNumber: "",
  privacyAgreed: false,
  residentIdAgreed: false,
  promotionAgreed: false,
};

const BANKS = [
  "KB국민은행", "신한은행", "우리은행", "하나은행",
  "NH농협은행", "IBK기업은행", "카카오뱅크", "토스뱅크", "기타",
];

// 공통 입력 스타일
const inputClass =
  "w-full py-3 px-4 text-[14px] font-light text-ink bg-cream border border-cream-dark rounded-[6px] outline-none transition-colors duration-200 focus:border-gold focus:bg-white placeholder:text-ink/30";
const selectClass =
  "w-full py-3 px-4 text-[14px] font-light text-ink bg-cream border border-cream-dark rounded-[6px] outline-none transition-colors duration-200 focus:border-gold focus:bg-white";
const labelClass = "block text-[12px] font-medium text-ink tracking-[0.5px] mb-2";
const sectionLabelClass =
  "text-[10px] font-semibold tracking-[3px] uppercase text-gold mb-4";

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // 모달 닫을 때 초기화
  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setStep("form");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          residentNumber: form.residentNumber,
          barExamType: form.barExamType,
          barExamDetail: form.barExamDetail,
          bio: form.bio,
          phone: form.phone,
          email: form.email,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          accountHolder: form.accountHolder,
          parkingNeeded: form.parkingNeeded === "yes",
          carNumber: form.carNumber || undefined,
          privacyAgreed: form.privacyAgreed,
          residentIdAgreed: form.residentIdAgreed,
          promotionAgreed: form.promotionAgreed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "오류가 발생했습니다.");
        return;
      }

      setStep("success");
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const barDetailLabel =
    form.barExamType === "judicial_exam"
      ? "사법시험 기수"
      : form.barExamType === "bar_exam"
        ? "변호사시험 회차"
        : "상세";

  const barDetailPlaceholder =
    form.barExamType === "judicial_exam"
      ? "예: 50회"
      : form.barExamType === "bar_exam"
        ? "예: 12회"
        : "";

  return (
    <div
      className="fixed inset-0 z-[500] bg-dark/70 backdrop-blur-[6px] flex items-center justify-center overflow-y-auto p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-[20px] max-w-[560px] w-full p-8 md:p-12 relative max-h-[90vh] overflow-y-auto my-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-mid border-none cursor-pointer flex items-center justify-center text-[16px] text-slate hover:bg-cream-dark transition-colors"
        >
          &#10005;
        </button>

        {step === "success" ? (
          /* --- 성공 화면 --- */
          <div className="text-center py-12">
            <div className="text-5xl mb-6">&#10003;</div>
            <h3 className="text-[24px] font-bold text-ink mb-4">
              신청이 접수되었습니다
            </h3>
            <p className="text-[14px] text-slate font-light leading-relaxed">
              검토 후 강의 조건이 포함된 동의서 링크를
              <br />
              이메일로 보내드리겠습니다.
            </p>
            <button
              onClick={onClose}
              className="mt-10 px-8 py-3 border border-gold/30 text-gold hover:bg-gold/10 transition-colors text-[14px] rounded-full cursor-pointer"
            >
              닫기
            </button>
          </div>
        ) : (
          /* --- 신청 폼 --- */
          <>
            <div className="mb-8">
              <p className="text-[10px] font-medium tracking-[4px] uppercase text-gold mb-3.5">
                Mentor Application
              </p>
              <h2 className="text-[26px] font-bold text-ink tracking-[-0.03em] leading-[1.25] mb-2">
                멘토 참여 신청
              </h2>
              <p className="text-[14px] text-slate font-light leading-[1.75]">
                기본 정보를 남겨주시면 담당자가 2영업일 내 연락드립니다.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-[13px] rounded-[6px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 기본 정보 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>기본 정보</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>
                      이름 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="홍길동"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      주민등록번호 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.residentNumber}
                      onChange={(e) => updateField("residentNumber", e.target.value)}
                      placeholder="000000-0000000"
                      required
                      className={inputClass}
                    />
                    <p className="text-[11px] text-slate-light mt-1.5 font-light">
                      원천징수 신고용 &middot; 암호화 저장
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* 변호사 자격 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>변호사 자격</legend>
                <div>
                  <label className={labelClass}>
                    자격시험 구분 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[14px] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="barExamType"
                        checked={form.barExamType === "judicial_exam"}
                        onChange={() => updateField("barExamType", "judicial_exam")}
                        className="accent-gold"
                      />
                      사법시험
                    </label>
                    <label className="flex items-center gap-2 text-[14px] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="barExamType"
                        checked={form.barExamType === "bar_exam"}
                        onChange={() => updateField("barExamType", "bar_exam")}
                        className="accent-gold"
                      />
                      변호사시험
                    </label>
                  </div>
                </div>
                {form.barExamType && (
                  <div>
                    <label className={labelClass}>
                      {barDetailLabel} <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.barExamDetail}
                      onChange={(e) => updateField("barExamDetail", e.target.value)}
                      placeholder={barDetailPlaceholder}
                      required
                      className={`${inputClass} md:w-1/2`}
                    />
                  </div>
                )}
              </fieldset>

              {/* 주요 이력 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>주요 이력</legend>
                <div>
                  <label className={labelClass}>
                    이력 사항 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder={`소속, 주요 경력, 전문분야 등을 자유롭게 기재해 주세요.\n\n예시)\n법무법인 ○○ 파트너 변호사 (2018~현재)\n서울중앙지방법원 조정위원\n전문분야: 기업소송, M&A, 건설분쟁`}
                    required
                    rows={6}
                    className={`${inputClass} resize-y min-h-[120px]`}
                  />
                  <p className="text-[11px] text-slate-light mt-1.5 font-light">
                    홍보 자료 및 수강생 안내에 활용됩니다 &middot; 10줄 내외
                  </p>
                </div>
              </fieldset>

              {/* 연락처 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>연락처</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>
                      휴대폰 번호 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="010-0000-0000"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      이메일 주소 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="master@lawfirm.com"
                      required
                      className={inputClass}
                    />
                    <p className="text-[11px] text-slate-light mt-1.5 font-light">
                      동의서 링크 발송용
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* 계좌 정보 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>계좌 정보</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>
                      은행명 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <select
                      value={form.bankName}
                      onChange={(e) => updateField("bankName", e.target.value)}
                      required
                      className={selectClass}
                    >
                      <option value="">선택</option>
                      {BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      계좌번호 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.accountNumber}
                      onChange={(e) => updateField("accountNumber", e.target.value)}
                      placeholder="- 없이 입력"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>
                      예금주 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.accountHolder}
                      onChange={(e) => updateField("accountHolder", e.target.value)}
                      placeholder="예금주명"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
              </fieldset>

              {/* 주차 안내 */}
              <fieldset className="space-y-4">
                <legend className={sectionLabelClass}>주차 안내</legend>
                <div>
                  <label className={labelClass}>
                    주차 필요 여부 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[14px] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="parkingNeeded"
                        checked={form.parkingNeeded === "yes"}
                        onChange={() => updateField("parkingNeeded", "yes")}
                        className="accent-gold"
                      />
                      필요
                    </label>
                    <label className="flex items-center gap-2 text-[14px] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="parkingNeeded"
                        checked={form.parkingNeeded === "no"}
                        onChange={() => updateField("parkingNeeded", "no")}
                        className="accent-gold"
                      />
                      불필요
                    </label>
                  </div>
                </div>
                {form.parkingNeeded === "yes" && (
                  <div>
                    <label className={labelClass}>
                      차량번호 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.carNumber}
                      onChange={(e) => updateField("carNumber", e.target.value)}
                      placeholder="12가 3456"
                      required
                      className={`${inputClass} md:w-1/2`}
                    />
                  </div>
                )}
              </fieldset>

              {/* 동의 사항 */}
              <fieldset className="space-y-3 border-t border-cream-dark pt-6">
                <legend className={sectionLabelClass}>동의 사항</legend>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.privacyAgreed}
                    onChange={(e) => updateField("privacyAgreed", e.target.checked)}
                    className="mt-0.5 accent-gold"
                  />
                  <span className="text-[13px] text-ink/80">
                    개인정보 수집&middot;이용에 동의합니다{" "}
                    <span className="text-[11px] text-gold/60 ml-1">필수</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.residentIdAgreed}
                    onChange={(e) => updateField("residentIdAgreed", e.target.checked)}
                    className="mt-0.5 accent-gold"
                  />
                  <span className="text-[13px] text-ink/80">
                    고유식별정보(주민등록번호) 수집&middot;이용에 동의합니다{" "}
                    <span className="text-[11px] text-gold/60 ml-1">필수</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.promotionAgreed}
                    onChange={(e) => updateField("promotionAgreed", e.target.checked)}
                    className="mt-0.5 accent-gold"
                  />
                  <span className="text-[13px] text-ink/80">
                    이력 정보의 홍보 자료 활용에 동의합니다{" "}
                    <span className="text-[11px] text-gold/60 ml-1">필수</span>
                  </span>
                </label>
              </fieldset>

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gold text-white font-semibold text-[13px] tracking-[2px] uppercase rounded-full cursor-pointer transition-all duration-300 hover:bg-gold-dark hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "처리 중..." : "멘토 참여 신청하기"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
