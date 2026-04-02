"use client";

import { useEffect, useRef } from "react";

const stats = [
  { num: "24", unit: "강", label: "총 강의 수" },
  { num: "12", unit: "주", label: "부트캠프 기간" },
  { num: "50", unit: "명", label: "1기 수강 정원" },
  { num: "2", unit: "시간", label: "회당 강의 시간" },
];

export default function Statistics() {
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
      { threshold: 0.15 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-white py-[clamp(100px,12vw,160px)] relative overflow-hidden border-y border-cream-dark">
      <div className="absolute -bottom-[25%] -left-[5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(27,97,201,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)] relative z-10">
        <div className="reveal mb-20">
          <p className="text-[1rem] font-medium tracking-[0.12px] uppercase text-slate-light mb-5">
            Numbers That Matter
          </p>
          <h2 className="text-[clamp(36px,5vw,64px)] font-bold text-ink leading-[1.12] tracking-normal">
            숫자로 보는
            <br />
            <span className="text-gold">실전 압축 부트캠프</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`reveal reveal-delay-${i + 1} py-12 px-10 relative md:border-l md:border-cream-dark ${
                i === stats.length - 1 ? "md:border-r md:border-r-cream-dark" : ""
              } ${i < 2 ? "max-md:border-b max-md:border-cream-dark" : ""}`}
            >
              <div className="text-[clamp(52px,6vw,80px)] font-bold text-ink leading-none tracking-normal mb-2.5">
                {s.num}
                <span className="text-[clamp(24px,3vw,40px)] text-gold font-medium">
                  {s.unit}
                </span>
              </div>
              <p className="text-[1rem] font-normal text-slate-light tracking-[0.08px] leading-[1.6]">
                {s.label}
              </p>
              <div className="absolute bottom-0 left-10 w-7 h-0.5 bg-gold rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
