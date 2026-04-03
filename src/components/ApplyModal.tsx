"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { curriculum } from "@/data/curriculum";

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
  feeLimit: string;
  feeDocNeeded: "" | "yes" | "no";
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
  feeLimit: "",
  feeDocNeeded: "",
  privacyAgreed: false,
  residentIdAgreed: false,
  promotionAgreed: false,
};

const PROGRAM_NAME = "리걸크루 변호사 실전 압축 부트캠프 1기";

const PROGRAM_INFO = [
  { label: "프로그램명", value: PROGRAM_NAME },
  { label: "연수 기간", value: "2026. 5. 12.(화) ~ 2026. 7. 30.(목)" },
  { label: "교육 시간", value: "매주 화·목 19:00~21:00, 회당 2시간 (총 24강)" },
  { label: "강의 방식", value: "오프라인 교육, 부트캠프장 주도 1:1 실무 워크숍" },
  { label: "강의 장소", value: "드림플러스 강남 (서울특별시 서초구 강남대로 311)" },
  { label: "수강 인원", value: "1기 50명 제한" },
  { label: "관련문의", value: "contact@legalcrew.co.kr" },
];


// 공통 입력 스타일 (Uber: 입력 8px radius, 1px 검정 보더)
const inputClass =
  "w-full py-3 px-4 text-[1rem] font-normal text-ink bg-cream border border-ink rounded-lg outline-none transition-colors duration-200 focus:border-ink focus:bg-white placeholder:text-slate-light";
const selectClass =
  "w-full py-3 px-4 text-[1rem] font-normal text-ink bg-cream border border-ink rounded-lg outline-none transition-colors duration-200 focus:border-ink focus:bg-white";
const labelClass = "block text-[1rem] font-medium text-ink mb-2";
const sectionLabelClass = "font-heading text-[1rem] text-ink mb-4";

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [consentPopup, setConsentPopup] = useState<string | null>(null);

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

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  };

  const assignedLectures = useMemo(() => {
    const input = form.name.trim();
    if (input.length < 2) return [];

    const inputNorm = input.replace(/\s+/g, "");
    const getNoNum = (no: string) => {
      const n = parseInt(no.replace(/[^0-9]/g, ""), 10);
      return Number.isNaN(n) ? 0 : n;
    };

    return curriculum
      .filter((item) => {
        if (!item.instructor || item.instructor === "—") return false;
        const instructor = item.instructor;
        const baseName = instructor.split("(")[0].trim();

        const baseNorm = baseName.replace(/\s+/g, "");
        const instructorNorm = instructor.replace(/\s+/g, "");

        return (
          baseName.includes(input) ||
          instructor.includes(input) ||
          baseNorm.includes(inputNorm) ||
          instructorNorm.includes(inputNorm)
        );
      })
      .sort((a, b) => getNoNum(a.no) - getNoNum(b.no));
  }, [form.name]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programName: PROGRAM_NAME,
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
          feeLimit: form.feeLimit || undefined,
          feeDocNeeded: form.feeDocNeeded === "yes" ? true : form.feeDocNeeded === "no" ? false : undefined,
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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleBarExamDetailChange = (value: string) => {
    if (value === "") {
      updateField("barExamDetail", "");
      return;
    }
    if (!/^\d*$/.test(value)) {
      showToast("숫자만 입력해주세요");
      return;
    }
    updateField("barExamDetail", value);
  };

  const handleFeeLimitChange = (value: string) => {
    if (value === "") {
      updateField("feeLimit", "");
      return;
    }
    if (!/^\d*$/.test(value)) {
      showToast("숫자만 입력해주세요");
      return;
    }
    updateField("feeLimit", value);
  };

  const barDetailLabel =
    form.barExamType === "judicial_exam"
      ? "연수원 기수"
      : form.barExamType === "bar_exam"
        ? "변호사시험 회차"
        : "상세";

  const barDetailPlaceholder =
    form.barExamType === "judicial_exam"
      ? "예시: 00기"
      : form.barExamType === "bar_exam"
        ? "예시: 00회"
        : "";

  return (
    <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-[4px] flex items-center justify-center overflow-y-auto p-6 scrollbar-visible">
      {/* 토스트 메시지 */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[600] bg-ink text-white px-5 py-3 rounded-full text-caption font-medium shadow-uber-float animate-fade-in">
          {toast}
        </div>
      )}
      <div className="bg-white rounded-xl max-w-[840px] w-full p-8 md:p-12 relative max-h-[90vh] overflow-y-auto my-6 shadow-airtable border border-[#e2e2e2] scrollbar-visible">
        {/* 닫기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#f3f3f3] border border-[#e2e2e2] cursor-pointer flex items-center justify-center text-[1.1rem] text-ink hover:bg-[#e2e2e2] transition-colors"
        >
          &#10005;
        </button>

        {step === "success" ? (
          /* --- 성공 화면 --- */
          <div className="text-center py-12">
            <div className="text-5xl mb-6">&#10003;</div>
            <h3 className="text-[24px] font-bold text-ink mb-4">
              사전 정보가 접수되었습니다
            </h3>
            <p className="text-[1.05rem] text-slate font-light leading-relaxed">
              검토 후 강의 조건이 포함된 동의서 링크를 이메일로 보내드립니다.
            </p>
            <button
              onClick={onClose}
              className="mt-10 px-6 py-3 border border-ink text-ink hover:bg-[#e2e2e2] transition-colors text-[1rem] rounded-full cursor-pointer font-medium"
            >
              닫기
            </button>
          </div>
        ) : (
          /* --- 신청 폼 --- */
          <>
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-ink tracking-[-0.03em] leading-[1.25] mb-2">
                마스터 사전 정보 등록
              </h2>
              <p className="text-[1.05rem] text-slate font-light leading-[1.75]">
                강의 준비 및 홍보 자료 제작을 위해, 아래 정보를 제출해 주세요.
              </p>
            </div>

            {/* 프로그램 기본 정보 (읽기전용) */}
            <div className="mb-8 p-5 bg-[#f3f3f3] border border-[#e2e2e2] rounded-xl">
              <p className={sectionLabelClass}>프로그램 정보</p>
              <dl className="space-y-2 text-sm">
                {PROGRAM_INFO.map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <dt className="text-ink/50 font-medium whitespace-nowrap min-w-[80px]">{label}</dt>
                    <dd className="text-ink font-light">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[1rem] rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-9">
              {/* 기본 정보 */}
              <fieldset className="space-y-6">
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
                    {form.name.trim().length >= 2 && (
                      <div className="mt-4 p-4 bg-[#f3f3f3] border border-[#e2e2e2] rounded-xl">
                        <p className="text-[1rem] font-semibold tracking-[0.12px] text-ink mb-3">
                          배정된 과목/스케줄
                        </p>
                        {assignedLectures.length > 0 ? (
                          <div className="space-y-3">
                            {assignedLectures.map((item) => (
                              <div
                                key={item.no}
                                className="pt-2 border-t border-cream-dark first:border-t-0 first:pt-0"
                              >
                                <div className="flex items-baseline justify-between gap-4">
                                  <span className="text-[1rem] font-semibold text-gold">
                                    {item.no}
                                  </span>
                                  <span className="text-[1rem] text-slate-light font-light">
                                    {item.date}
                                  </span>
                                </div>
                                <div className="text-[1.05rem] text-ink font-medium leading-[1.4] mt-1">
                                  {item.part}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[1rem] text-slate-light font-light leading-[1.7]">
                            입력하신 이름과 일치하는 배정 정보를 찾지 못했습니다.
                          </p>
                        )}
                      </div>
                    )}
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
                    <p className="text-[1rem] text-slate-light mt-1.5 font-light">
                      주민등록번호는 강사료 원천징수 신고를 위해 수집되는 정보입니다.
                      <br />
                      해당 정보는 암호화 저장되며, 목적 달성 후 파기됩니다.
                    </p>
                  </div>
                </div>
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
                    <p className="text-[1rem] text-slate-light mt-1.5 font-light">
                      동의서 링크 발송용
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* 변호사 자격 */}
              <fieldset className="space-y-6">
                <legend className={sectionLabelClass}>변호사 자격</legend>
                <div>
                  <label className={labelClass}>
                    자격시험 구분 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="barExamType"
                        checked={form.barExamType === "judicial_exam"}
                        onChange={() => updateField("barExamType", "judicial_exam")}
                        className="accent-gold"
                      />
                      사법시험
                    </label>
                    <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
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
                      inputMode="numeric"
                      value={form.barExamDetail}
                      onChange={(e) => handleBarExamDetailChange(e.target.value)}
                      placeholder={barDetailPlaceholder}
                      required
                      className={`${inputClass} md:w-1/2`}
                    />
                  </div>
                )}
              </fieldset>

              {/* 주요 이력 */}
              <fieldset className="space-y-6">
                <legend className={sectionLabelClass}>주요 이력</legend>
                <div>
                  <label className={labelClass}>
                    이력 사항 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <p className="text-[1rem] text-slate-light mt-1.5 font-light">
                    입력하신 이력은 홍보 자료 및 수강생 안내에 활용됩니다.
                  </p>
                  <textarea
                    value={form.bio}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder={`소속, 주요 경력, 전문분야 등을 자유롭게 기재해 주세요.\n\n예시)\n법무법인 ○○ 파트너 변호사 (2018~현재)\n서울중앙지방법원 조정위원\n전문분야: 기업소송, M&A, 건설분쟁`}
                    required
                    rows={10}
                    className={`${inputClass} resize-y min-h-[220px]`}
                  />

                </div>
              </fieldset>


              {/* 계좌 정보 */}
              <fieldset className="space-y-6">
                <legend className={sectionLabelClass}>계좌 정보</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>
                      은행명 <span className="text-gold ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.bankName}
                      onChange={(e) => updateField("bankName", e.target.value)}
                      placeholder="예: KB국민은행"
                      required
                      className={inputClass}
                    />
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
              <fieldset className="space-y-6">
                <legend className={sectionLabelClass}>주차 안내</legend>
                <div>
                  <label className={labelClass}>
                    주차 필요 여부 <span className="text-gold ml-0.5">*</span>
                  </label>
                  <div className="flex gap-6 mt-1">
                    <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
                      <input
                        type="radio"
                        name="parkingNeeded"
                        checked={form.parkingNeeded === "yes"}
                        onChange={() => updateField("parkingNeeded", "yes")}
                        className="accent-gold"
                      />
                      필요
                    </label>
                    <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
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

              {/* 강사료 및 정산 관련 확인 */}
              <fieldset className="space-y-6">
                <legend className={sectionLabelClass}>강사료 및 정산 관련 확인</legend>
                <p className="text-sm text-slate font-light leading-relaxed -mt-1">
                  공공기관 재직자 등 내부 규정상 강사료 한도 확인이 필요한 경우에만 작성해 주시기 바랍니다.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-md:!grid-cols-1">
                  <div>
                    <label className={labelClass}>강사료 한도</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.feeLimit}
                      onChange={(e) => handleFeeLimitChange(e.target.value)}
                      placeholder="00만원 (1회당)"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>강사료 내역 공문</label>
                    <div className="flex gap-6 mt-1">
                      <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
                        <input
                          type="radio"
                          name="feeDocNeeded"
                          checked={form.feeDocNeeded === "yes"}
                          onChange={() => updateField("feeDocNeeded", "yes")}
                          className="accent-gold"
                        />
                        필요
                      </label>
                      <label className="flex items-center gap-2 text-[1.05rem] font-light text-ink cursor-pointer">
                        <input
                          type="radio"
                          name="feeDocNeeded"
                          checked={form.feeDocNeeded === "no"}
                          onChange={() => updateField("feeDocNeeded", "no")}
                          className="accent-gold"
                        />
                        불필요
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* 동의 사항 */}
              <fieldset className="space-y-5 border-t border-cream-dark pt-9">
                <legend className={sectionLabelClass}>동의 사항</legend>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.privacyAgreed}
                    onChange={(e) => updateField("privacyAgreed", e.target.checked)}
                    className="mt-0.5 accent-gold cursor-pointer"
                  />
                  <span className="text-[1rem] text-ink/80">
                    개인정보 수집&middot;이용 및 제3자 제공에 동의합니다{" "}
                    <span className="text-[1rem] text-gold/60 ml-1">필수</span>
                    <button
                      type="button"
                      onClick={() => setConsentPopup("privacy")}
                      className="text-caption text-gold underline underline-offset-2 ml-2 cursor-pointer hover:text-gold-dark"
                    >
                      내용보기
                    </button>
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.residentIdAgreed}
                    onChange={(e) => updateField("residentIdAgreed", e.target.checked)}
                    className="mt-0.5 accent-gold cursor-pointer"
                  />
                  <span className="text-[1rem] text-ink/80">
                    홍보 및 자료제공 활용에 동의합니다{" "}
                    <span className="text-[1rem] text-gold/60 ml-1">필수</span>
                    <button
                      type="button"
                      onClick={() => setConsentPopup("residentId")}
                      className="text-caption text-gold underline underline-offset-2 ml-2 cursor-pointer hover:text-gold-dark"
                    >
                      내용보기
                    </button>
                  </span>
                </div>
              </fieldset>

              {/* 동의 내용 팝업 */}
              {consentPopup && (
                <div
                  className="fixed inset-0 z-[700] bg-dark/60 backdrop-blur-[4px] flex items-center justify-center p-6"
                  onClick={() => setConsentPopup(null)}
                >
                  <div
                    className="bg-white rounded-xl max-w-[600px] w-full p-8 relative max-h-[80vh] overflow-y-auto shadow-airtable scrollbar-visible"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setConsentPopup(null)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#f3f3f3] border border-[#e2e2e2] cursor-pointer flex items-center justify-center text-[1.1rem] text-ink hover:bg-[#e2e2e2] transition-colors"
                    >
                      &#10005;
                    </button>

                    {consentPopup === "privacy" && (
                      <>
                        <h3 className="text-[1.2rem] font-bold text-ink mb-6 pr-8">
                          개인정보 수집&middot;이용 및 제3자 제공 동의
                        </h3>
                        <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">1. 수집/이용 목적</p>
                            <p>리걸크루 변호사 실전 압축 부트캠프 운영, 강사료 지급, 원천징수 등 세무 처리, 수강생 공지 및 행정 업무</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">2. 수집 항목</p>
                            <p>성명, 연락처, 이메일, 주소, 주민등록번호, 계좌번호, 소속 및 경력 정보</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">3. 보유/이용 기간</p>
                            <p>수집&middot;이용 동의일로부터 관련 법령상 보관 의무 종료 시까지</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">4. 고유식별정보</p>
                            <p>주민등록번호</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">5. 제3자 제공 대상</p>
                            <p>리걸크루가 프로그램 운영을 위하여 위탁 또는 지정하는 운영업체(필요한 경우에 한함)</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">6. 제3자 제공 목적</p>
                            <p>정산 및 관련 행정 처리</p>
                          </div>
                        </div>
                      </>
                    )}

                    {consentPopup === "residentId" && (
                      <>
                        <h3 className="text-[1.2rem] font-bold text-ink mb-6 pr-8">
                          홍보 및 자료제공 활용 동의
                        </h3>
                        <div className="space-y-4 text-sm text-ink/80 leading-relaxed">
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">1. 홍보 콘텐츠 게재</p>
                            <p>강의 내용 일부를 리걸크루의 기사, 블로그, 홈페이지, SNS, 브로슈어 등 프로그램 안내&middot;홍보 콘텐츠에 게재</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">2. 교재/자료집 제작 및 배부</p>
                            <p>본 프로그램을 목적으로 본인이 작성한 강의안과 다른 강의안을 함께 교재 또는 자료집으로 제작하여 수강생에게 배부하고, 잔여 수량은 프로그램 운영 범위 내에서 활용</p>
                          </div>
                          <div className="p-4 bg-white rounded-lg border border-[#e2e2e2]">
                            <p className="font-semibold text-ink mb-1">3. 발표 자료 공유</p>
                            <p>강의 시 사용한 PPT 또는 발표 자료를 요청 수강생에게 PDF 형태로 공유</p>
                          </div>
                        </div>
                      </>
                    )}


                    <button
                      type="button"
                      onClick={() => setConsentPopup(null)}
                      className="mt-6 w-full py-3 border border-ink text-ink hover:bg-[#e2e2e2] transition-colors text-[1rem] rounded-full cursor-pointer font-medium"
                    >
                      확인
                    </button>
                  </div>
                </div>
              )}

              {/* 제출 버튼 */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 bg-gold text-white font-semibold text-[1rem] rounded-full cursor-pointer transition-colors duration-200 hover:bg-gold-light shadow-airtable disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "처리 중..." : "마스터 사전 정보 등록하기"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
