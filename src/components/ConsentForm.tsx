"use client";

import { useState, FormEvent } from "react";

interface ConsentFormProps {
  instructor: { name: string };
  setting: {
    lectureTopic: string;
    feeAmount: number;
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
        <div className="text-5xl mb-6 text-green-400">&#10003;</div>
        <h2 className="font-heading text-[24px] font-bold mb-4">
          서명이 완료되었습니다
        </h2>
        <p className="text-[1.05rem] text-muted font-light leading-relaxed mb-8">
          동의서 서명이 정상적으로 접수되었습니다.
        </p>
        <a
          href={`/api/consent/${token}/pdf`}
          className="inline-block px-8 py-3 bg-gold text-ink font-semibold text-[1.05rem] rounded-full hover:bg-gold-light transition-colors"
        >
          동의서 PDF 다운로드
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 강의 조건 표시 */}
      <div className="bg-ink-mid border border-white/[0.06] p-6 rounded">
        <h3 className="text-[1rem] tracking-[3px] uppercase text-gold-dark mb-4 font-medium">
          강의 조건
        </h3>
        <div className="space-y-3 text-[1.05rem]">
          <div className="flex justify-between">
            <span className="text-muted">강사명</span>
            <span className="font-semibold">{instructor.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">강의 주제</span>
            <span className="font-semibold">{setting.lectureTopic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">강사료</span>
            <span className="font-semibold text-gold">
              {setting.feeAmount.toLocaleString()}원
            </span>
          </div>
          {setting.specialTerms && (
            <div className="pt-3 border-t border-white/[0.06]">
              <p className="text-muted text-[1rem] mb-1">특약사항</p>
              <p className="text-[1rem] whitespace-pre-wrap">{setting.specialTerms}</p>
            </div>
          )}
        </div>
      </div>

      {/* 동의 항목 */}
      <div className="space-y-3">
        <h3 className="text-[1rem] tracking-[3px] uppercase text-gold-dark mb-4 font-medium">
          동의 항목
        </h3>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={topicConfirmed}
            onChange={(e) => setTopicConfirmed(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[1rem] text-cream/80">
            위 강의 주제 및 일정을 확인하였습니다{" "}
            <span className="text-[1rem] text-gold/60 ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={feeAgreed}
            onChange={(e) => setFeeAgreed(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[1rem] text-cream/80">
            위 강사료 조건에 동의합니다{" "}
            <span className="text-[1rem] text-gold/60 ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={privacyAgreed}
            onChange={(e) => setPrivacyAgreed(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[1rem] text-cream/80">
            개인정보 수집&middot;이용에 동의합니다{" "}
            <span className="text-[1rem] text-gold/60 ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={residentIdAgreed}
            onChange={(e) => setResidentIdAgreed(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[1rem] text-cream/80">
            고유식별정보(주민등록번호) 수집&middot;이용에 동의합니다{" "}
            <span className="text-[1rem] text-gold/60 ml-1">필수</span>
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer min-h-[44px] py-1">
          <input
            type="checkbox"
            checked={portraitAgreed}
            onChange={(e) => setPortraitAgreed(e.target.checked)}
            className="mt-0.5 accent-gold"
          />
          <span className="text-[1rem] text-cream/80">
            초상권 활용에 동의합니다{" "}
            <span className="text-[1rem] text-cream/30 ml-1">선택</span>
          </span>
        </label>
      </div>

      {/* 서명 */}
      <div>
        <h3 className="text-[1rem] tracking-[3px] uppercase text-gold-dark mb-4 font-medium">
          서명
        </h3>
        <label className="block text-[1rem] text-cream/70 mb-2">
          본인 이름 (신청 시 이름과 동일하게 입력)
        </label>
        <input
          type="text"
          value={signedName}
          onChange={(e) => setSignedName(e.target.value)}
          placeholder="홍길동"
          className="w-full sm:w-1/2 bg-ink border border-white/[0.08] px-4 py-3 text-[1.05rem] text-cream placeholder:text-cream/20 focus:border-gold/40 focus:outline-none transition-colors"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-[1rem] rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full py-4 bg-gold text-ink font-semibold text-[1.1rem] rounded-full hover:bg-gold-light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "처리 중..." : "동의서 서명하기"}
      </button>
    </form>
  );
}
