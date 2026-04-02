"use client";

import { useEffect, useRef } from "react";

const items = [
  { label: "연수 기간", value: "2026. 5. 12.(화) ~ 7. 30.(목)", sub: "" },
  { label: "교육 시간", value: "매주 화·목 19:00~21:00", sub: "회당 2시간 (총 24강)" },
  { label: "강의 방식", value: "오프라인 교육, 부트캠프장 주도 1:1 실무 워크숍", sub: "" },
  { label: "강의 장소", value: "드림플러스 강남", sub: "서울특별시 서초구 강남대로 311" },
  { label: "수강 인원", value: "1기 50명 제한", sub: "" },
];

const stats = [
  { num: "24", unit: "강", label: "총 강의 수" },
  { num: "12", unit: "주", label: "부트캠프 기간" },
  { num: "50", unit: "명", label: "1기 수강 정원" },
  { num: "2", unit: "시간", label: "회당 강의 시간" },
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
    <section className="bg-cream py-[clamp(80px,10vw,120px)] border-b border-cream-dark">
      <div className="max-w-[1080px] mx-auto px-[clamp(16px,4vw,48px)]">
        <div ref={headerRef} className="reveal mb-12">
          <h2 className="font-heading text-[clamp(30px,4vw,48px)] font-medium text-ink leading-[1.25] tracking-normal">
            프로그램 개요
          </h2>
          <p className="mt-3 text-[1.05rem] text-slate font-normal leading-[1.8] tracking-[0.18px]">
            리걸크루 변호사 실전 압축 부트캠프
          </p>
        </div>

        <div ref={gridRef} className="reveal reveal-delay-1 border-t border-cream-dark">
          {items.map((item, idx) => (
            <div
              key={item.label}
              className={`py-5 border-b border-cream-dark ${idx === 4 ? "" : ""}`}
            >
              <p className="text-[0.9rem] font-medium tracking-[0.12px] uppercase text-gold mb-1.5">
                {item.label}
              </p>
              <p className="text-[1.08rem] font-medium text-ink leading-[1.5] tracking-[0.1px]">
                {item.value}
              </p>
              {item.sub ? (
                <p className="text-[0.98rem] text-slate-light font-light mt-0.5">{item.sub}</p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-cream-dark">
          {stats.map((s) => (
            <div key={s.label} className="py-4 border-b border-cream-dark">
              <div className="text-[clamp(30px,4vw,42px)] font-medium text-ink leading-none tracking-normal mb-1">
                {s.num}
                <span className="text-gold font-medium">
                  {s.unit}
                </span>
              </div>
              <p className="text-[0.98rem] text-slate-light font-light tracking-[0.08px] leading-[1.6]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-2 mt-10 text-[1.02rem] text-slate leading-[1.85] tracking-[0.18px] space-y-4">
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
