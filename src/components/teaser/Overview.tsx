"use client";

import { useEffect, useRef } from "react";

const items = [
  { label: "기간", value: "2026. 5. 12 ~ 7. 30", sub: "약 12주" },
  { label: "일정", value: "매주 화·목", sub: "회당 2시간, 총 24강" },
  { label: "방식", value: "오프라인", sub: "실무 워크숍 병행" },
  { label: "장소", value: "드림플러스 강남", sub: "서초구 강남대로 311" },
  { label: "수강인원", value: "50명 이상", sub: "사전 선발" },
];

export default function Overview() {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.3 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    if (gridRef.current) obs.observe(gridRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-cream-mid py-[clamp(100px,12vw,160px)]">
      <div className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)]">
        {/* 헤더 */}
        <div ref={headerRef} className="reveal text-center mb-[72px]">
          <span className="inline-flex items-center gap-2 text-[1rem] font-medium tracking-[0.12px] uppercase text-gold mb-5">
            <span className="w-[5px] h-[5px] rounded-full bg-gold shrink-0" />
            Program Overview
          </span>
          <h2 className="text-[clamp(30px,4vw,48px)] font-bold text-ink leading-[1.25] tracking-[-0.035em] mt-3">
            프로그램 개요
          </h2>
          <p className="mt-4 text-[1.1rem] text-slate font-light leading-[1.8]">
            The Rookie Camp — 변호사 실전 압축 부트캠프
          </p>
        </div>

        {/* 5개 카드 그리드 */}
        <div
          ref={gridRef}
          className="reveal reveal-delay-1 grid grid-cols-2 md:grid-cols-5 gap-px bg-cream-dark border border-cream-dark rounded-3xl overflow-hidden shadow-airtable-soft"
        >
          {items.map((item, idx) => (
            <div
              key={item.label}
              className={`bg-cream-mid py-11 px-5 text-center transition-colors duration-300 hover:bg-white ${
                idx === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <p className="text-[1rem] font-semibold tracking-[0.12px] uppercase text-gold mb-3.5">
                {item.label}
              </p>
              <p className="text-[1.1rem] font-semibold text-ink leading-[1.5] mb-1.5 tracking-[-0.01em]">
                {item.value}
              </p>
              <p className="text-[1rem] text-slate-light font-light">
                {item.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
