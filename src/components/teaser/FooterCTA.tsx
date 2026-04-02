"use client";

import { useEffect, useRef } from "react";

export default function FooterCTA({ onApplyClick }: { onApplyClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-cream py-[clamp(100px,12vw,160px)] relative overflow-hidden">
      {/* 장식 글로우 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(27,97,201,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)] text-center relative z-10">
        <p className="reveal text-[1rem] font-medium tracking-[0.12px] uppercase text-gold mb-7">
          Master Faculty
        </p>
        <h2 className="reveal reveal-delay-1 text-[clamp(36px,5.5vw,72px)] font-extrabold text-ink leading-[1.08] tracking-[-0.045em] mb-7">
          함께 만들어갈
          <br />
          <span className="text-gold">마스터</span>를
          <br />
          기다립니다
        </h2>
        <p className="reveal reveal-delay-2 text-[1.15rem] text-slate font-light leading-[1.85] max-w-[520px] mx-auto mb-13">
          마스터 참여 신청은 간단합니다.
          <br />
          기본 정보를 남겨주시면 담당자가 직접 연락드립니다.
        </p>
        <div className="reveal reveal-delay-3 flex items-center justify-center gap-4 flex-wrap mb-14">
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2.5 text-[1rem] font-medium tracking-[0.08px] uppercase px-6 py-3.5 rounded-[12px] bg-gold text-white border-none cursor-pointer transition-all duration-300 hover:bg-gold-dark hover:-translate-y-0.5 shadow-airtable hover:shadow-airtable-soft"
          >
            <span>마스터 참여 신청하기</span>
            <span className="w-[26px] h-[26px] rounded-full bg-white/18 flex items-center justify-center text-[1rem]">
              &rarr;
            </span>
          </button>
        </div>
        <div className="reveal reveal-delay-4 flex items-center justify-center gap-8 flex-wrap max-md:flex-col max-md:gap-3">
          {[
            { icon: "\uD83D\uDCC5", text: "2026년 5월 ~ 7월 운영" },
            { icon: "\uD83D\uDCCD", text: "드림플러스 강남 오프라인" },
            { icon: "\uD83D\uDCDE", text: "강선민 기획이사 / 교육 관련 010-9131-4827" },
          ].map((m) => (
            <div key={m.text} className="flex items-center gap-2 text-[1rem] text-slate-light font-light">
              <span className="text-[1.1rem]">{m.icon}</span>
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
