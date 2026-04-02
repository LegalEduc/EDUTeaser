"use client";

import { useEffect, useRef } from "react";

const items = [
  { label: "연수 기간", value: "2026. 5. 12.(화) ~ 7. 30.(목)", sub: "" },
  { label: "교육 시간", value: "매주 화·목 19:00~21:00", sub: "회당 2시간, 총 24강" },
  { label: "강의 방식", value: "오프라인 교육", sub: "실무 워크숍 병행" },
  { label: "강의 장소", value: "드림플러스 강남", sub: "서울특별시 서초구 강남대로 311" },
  { label: "수강 인원", value: "1기 50명 제한", sub: "" },
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
        <div ref={headerRef} className="reveal text-center mb-[72px]">
          <h2 className="text-[clamp(30px,4vw,48px)] font-bold text-ink leading-[1.25] tracking-[-0.035em] mt-3">
            프로그램 개요
          </h2>
          <p className="mt-4 text-[1.1rem] text-slate font-normal leading-[1.8] tracking-[0.18px]">
            리걸크루 변호사 실전 압축 부트캠프
          </p>
        </div>

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
              {item.sub ? (
                <p className="text-[1rem] text-slate-light font-light">{item.sub}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-2 mt-14 max-w-[800px] mx-auto text-[1.02rem] text-slate leading-[1.85] tracking-[0.18px] space-y-4">
          <p className="font-semibold text-ink">졸업 산출물 및 커리어 지원</p>
          <p>
            조원희 부트캠프장(법무법인 디엘지 대표변호사) 주도로 Personal Portfolio Book 완성을 위한 1:1 강평·피드백을
            제공하며, 검증된 수료생은 리걸크루 인재 DB에 우선 등록되어 채용·파트너십 기회와 연계될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
