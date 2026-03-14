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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(196,153,60,0.05)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)] text-center relative z-10">
        <p className="reveal text-[10px] font-medium tracking-[5px] uppercase text-gold mb-7">
          Join as a Mentor
        </p>
        <h2 className="reveal reveal-delay-1 text-[clamp(36px,5.5vw,72px)] font-extrabold text-ink leading-[1.08] tracking-[-0.045em] mb-7">
          함께 만들어갈
          <br />
          <span className="text-gold">멘토</span>를
          <br />
          기다립니다
        </h2>
        <p className="reveal reveal-delay-2 text-[16px] text-slate font-light leading-[1.85] max-w-[520px] mx-auto mb-13">
          멘토 신청은 간단합니다.
          <br />
          기본 정보를 남겨주시면 담당자가 직접 연락드립니다.
        </p>
        <div className="reveal reveal-delay-3 flex items-center justify-center gap-4 flex-wrap mb-14">
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2.5 text-[12px] font-medium tracking-[2px] uppercase px-8 py-4 rounded-full bg-gold text-white border-none cursor-pointer transition-all duration-300 hover:bg-gold-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,153,60,0.3)]"
          >
            <span>멘토 참여 신청하기</span>
            <span className="w-[26px] h-[26px] rounded-full bg-white/18 flex items-center justify-center text-[13px]">
              &rarr;
            </span>
          </button>
        </div>
        <div className="reveal reveal-delay-4 flex items-center justify-center gap-8 flex-wrap max-md:flex-col max-md:gap-3">
          {[
            { icon: "\uD83D\uDCC5", text: "2026년 5월 ~ 7월 운영" },
            { icon: "\uD83D\uDCCD", text: "드림플러스 강남 오프라인" },
            { icon: "\uD83D\uDCDE", text: "담당: 강선민 이사" },
          ].map((m) => (
            <div key={m.text} className="flex items-center gap-2 text-[13px] text-slate-light font-light">
              <span className="text-[15px]">{m.icon}</span>
              <span>{m.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
