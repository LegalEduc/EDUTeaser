"use client";

import { useEffect, useState, use } from "react";
import ConsentForm from "@/components/ConsentForm";

interface ConsentData {
  instructor: { name: string };
  setting: {
    lectureTopic: string;
    feeAmount: number;
    specialTerms: string | null;
  };
  alreadySigned: boolean;
}

export default function ConsentPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const [data, setData] = useState<ConsentData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/consent/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("유효하지 않은 링크이거나 만료된 링크입니다."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-muted text-[14px]">불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-[16px] mb-4">{error}</p>
          <p className="text-muted text-[13px]">
            문의: cs@legalcrew.co.kr
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="max-w-[640px] mx-auto px-6 py-12">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <p className="font-logo text-[16px] mb-6">
            LegalCrew <span className="italic">Academy</span>
          </p>
          <p className="text-[13px] tracking-[5px] uppercase text-gold-dark mb-4">
            Consent
          </p>
          <h1 className="font-heading text-[26px] font-bold mb-3">
            강의 동의서
          </h1>
          <p className="text-[14px] text-muted font-light">
            리걸크루 변호사 실전 압축 부트캠프 &mdash; The Rookie Camp
          </p>
        </div>

        {data.alreadySigned ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-6 text-green-400">&#10003;</div>
            <h2 className="font-heading text-[24px] font-bold mb-4">
              이미 서명이 완료되었습니다
            </h2>
            <p className="text-[14px] text-muted font-light mb-8">
              아래 버튼으로 동의서 PDF를 다운로드하실 수 있습니다.
            </p>
            <a
              href={`/api/consent/${token}/pdf`}
              className="inline-block px-8 py-3 bg-gold text-ink font-semibold text-[14px] rounded-full hover:bg-gold-light transition-colors"
            >
              동의서 PDF 다운로드
            </a>
          </div>
        ) : (
          <ConsentForm
            instructor={data.instructor}
            setting={data.setting}
            token={token}
          />
        )}

        {/* 푸터 */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-[12px] text-muted">
            문의: cs@legalcrew.co.kr &middot; 010-0000-0000
          </p>
          <p className="text-[11px] text-cream/20 mt-2">
            &copy; 2026 LegalCrew. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
