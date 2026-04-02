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
        <p className="text-muted text-[1.05rem]">불러오는 중...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 text-[1.15rem] mb-4">{error}</p>
          <p className="text-muted text-[1rem]">
            문의: contact@legalcrew.co.kr
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 헤더 */}
        <div className="text-center mb-8 sm:mb-10">
          <p className="font-logo text-[1.15rem] mb-6">
            LegalCrew <span className="italic">Academy</span>
          </p>
          <p className="text-[1rem] tracking-[0.12px] uppercase text-gold-light mb-4">
            동의서
          </p>
          <h1 className="font-heading text-[22px] sm:text-[26px] font-bold mb-3">
            강의 동의서
          </h1>
          <p className="text-[1.05rem] text-muted font-light">
            리걸크루 변호사 실전 압축 부트캠프
          </p>
        </div>

        {data.alreadySigned ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-6 text-green-400">&#10003;</div>
            <h2 className="font-heading text-[24px] font-bold mb-4">
              이미 서명이 완료되었습니다
            </h2>
            <p className="text-[1.05rem] text-muted font-light mb-8">
              아래 버튼으로 동의서 PDF를 다운로드하실 수 있습니다.
            </p>
            <a
              href={`/api/consent/${token}/pdf`}
              className="inline-block px-8 py-3 bg-gold text-white font-semibold text-[1.05rem] rounded-[12px] hover:bg-gold-light transition-colors shadow-airtable"
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
          <p className="text-[1rem] text-muted">
            문의: contact@legalcrew.co.kr &middot; 010-9131-4827
          </p>
          <p className="text-[1rem] text-cream/20 mt-2">
            &copy; 2026 LegalCrew. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
