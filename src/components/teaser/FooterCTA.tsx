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
        <h2 className="reveal reveal-delay-1 text-[clamp(36px,5.5vw,72px)] font-extrabold text-ink leading-[1.08] tracking-[-0.045em] mb-7">
          마스터 사전
          <br />
          <span className="text-gold">정보 등록</span>
          <br />
          안내
        </h2>
        <p className="reveal reveal-delay-2 text-[1.15rem] text-slate font-light leading-[1.85] max-w-[520px] mx-auto mb-13">
          입력하신 내용은 강의 준비 및 홍보 자료 제작에 반영됩니다.
        </p>
      </div>
    </section>
  );
}
