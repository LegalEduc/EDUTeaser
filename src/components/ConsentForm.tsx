"use client";

import { useState, FormEvent } from "react";

interface ConsentFormProps {
  instructor: { name: string };
  setting: {
    lectureTopic: string;
    lectureCount: number;
    feeAmount: number;
    totalFee: number;
    specialTerms: string | null;
  };
  token: string;
}

export default function ConsentForm({ instructor, setting, token }: ConsentFormProps) {
  const [topicConfirmed, setTopicConfirmed] = useState(false);
  const [feeAgreed, setFeeAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [residentIdAgreed, setResidentIdAgreed] = useState(false);
  const [portraitAgreed, setPortraitAgreed] = useState(false);
  const [signedName, setSignedName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const allRequired = topicConfirmed && feeAgreed && privacyAgreed && residentIdAgreed;
  const canSubmit = allRequired && signedName.trim().length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/consent/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicConfirmed,
          feeAgreed,
          privacyAgreed,
          residentIdAgreed,
          portraitAgreed,
          signedName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "오류가 발생했습니다.");
        return;
      }

      setDone(true);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-6 text-ink font-light">&#10003;</div>
        <h2 className="font-heading text-[24px] font-bold mb-4">서명이 완료되었습니다</h2>
        <p className="text-[1.05rem] text-slate leading-relaxed mb-8">
          동의서 서명이 정상적으로 접수되었습니다.
        </p>
        <a
          href={`/api/consent/${token}/pdf`}
          className="inline-block px-8 py-3 bg-gold text-white font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors shadow-airtable"
        >
          동의서 PDF 다운로드
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white border border-[#e2e2e2] shadow-airtable-soft p-6 rounded-xl">
        <h3 className="font-heading text-[18px] font-bold text-ink mb-4">강의 조건</h3>
        <div className="space-y-3 text-[1.05rem]">
          <div className="flex justify-between gap-4">
            <span className="text-slate shrink-0">강사명</span>
            <span className="font-semibold text-ink text-right">{instructor.name}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate shrink-0">강의 주제</span>
            <span className="font-semibold text-ink text-right">{setting.lectureTopic}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate shrink-0">총 강의횟수</span>
            <span className="font-semibold text-ink text-right">{setting.lectureCount}회</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate shrink-0">강사료</span>
            <span className="font-semibold text-ink text-right">
              {setting.feeAmount.toLocaleString()}원 (1회당)
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate shrink-0">총 강사료</span>
            <span className="font-semibold text-ink text-right">
              {setting.totalFee.toLocaleString()}원
            </span>
          </div>
          {setting.specialTerms && (
            <div className="pt-3 border-t border-[#e2e2e2]">
              <p className="text-slate text-[1rem] mb-1">특약사항</p>
              <p className="text-[1rem] text-ink whitespace-pre-wrap">{setting.specialTerms}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-heading text-[18px] font-bold text-ink mb-4">동의 항목</h3>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={topicConfirmed}
            onChange={(e) => setTopicConfirmed(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="text-[1rem] text-ink">
            위 강의 주제를 확인하였습니다{" "}
            <span className="text-slate-light ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={feeAgreed}
            onChange={(e) => setFeeAgreed(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="text-[1rem] text-ink">
            위 강사료 조건에 동의합니다{" "}
            <span className="text-slate-light ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="text-[1rem] text-ink">
            개인정보 수집&middot;이용에 동의합니다{" "}
            <span className="text-slate-light ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={residentIdAgreed}
            onChange={(e) => setResidentIdAgreed(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="text-[1rem] text-ink">
            고유식별정보(주민등록번호) 수집&middot;이용에 동의합니다{" "}
            <span className="text-slate-light ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={portraitAgreed}
            onChange={(e) => setPortraitAgreed(e.target.checked)}
            className="mt-0.5 accent-ink"
          />
          <span className="text-[1rem] text-ink">
            초상권 활용에 동의합니다{" "}
            <span className="text-slate-light ml-1">선택</span>
          </span>
        </label>
      </div>

      <div>
        <h3 className="font-heading text-[18px] font-bold text-ink mb-4">서명</h3>
        <label className="block text-[1rem] text-slate mb-2">
          본인 이름 (신청 시 이름과 동일하게 입력)
        </label>
        <input
          type="text"
          value={signedName}
          onChange={(e) => setSignedName(e.target.value)}
          placeholder="홍길동"
          className="w-full sm:w-1/2 bg-white border border-ink px-4 py-3 text-[1.05rem] text-ink placeholder:text-slate-light focus:ring-2 focus:ring-ink/20 focus:border-ink focus:outline-none transition-colors rounded-lg"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 text-[1rem] rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full py-4 bg-gold text-white font-semibold text-[1.1rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-airtable min-h-[48px]"
      >
        {isSubmitting ? "처리 중..." : "동의서 서명하기"}
      </button>
    </form>
  );
}
