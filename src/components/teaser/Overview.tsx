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
  { num: "48", unit: "시간", label: "총 강의 시간" },
  { num: "12", unit: "주", label: "부트캠프 기간" },
  { num: "1:1", unit: "", label: "부트캠프장 주도 개별 강평" },
  { num: "수료 후", unit: "", label: "대한변협 전문연수 인정 신청 예정" },
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
    <section className="bg-cream-mid py-[clamp(64px,10vw,96px)]">
      <div className="max-w-[1136px] mx-auto px-[clamp(24px,5vw,64px)]">
        <div ref={headerRef} className="reveal text-center mb-14 md:mb-16">
          <h2 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] text-ink leading-[1.22]">
            프로그램 개요
          </h2>
          <p className="mt-3 text-[1rem] text-slate font-normal leading-[1.5]">
            리걸크루 변호사 실전 압축 부트캠프
          </p>
        </div>

        <div
          ref={gridRef}
          className="reveal reveal-delay-1 bg-white rounded-xl shadow-airtable overflow-hidden"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-y divide-[#e2e2e2] md:divide-y-0">
            {items.map((item, idx) => (
              <div
                key={item.label}
                className={`py-10 px-4 md:px-5 text-center ${idx === 4 ? "col-span-2 md:col-span-1" : ""}`}
              >
                <p className="text-caption font-semibold text-ink mb-3">{item.label}</p>
                <p className="text-[1rem] font-semibold text-ink leading-snug mb-1">{item.value}</p>
                {item.sub ? <p className="text-caption text-slate leading-snug">{item.sub}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="text-center rounded-xl bg-white py-8 px-3 shadow-airtable-soft"
            >
              <div className="text-[clamp(36px,4.5vw,52px)] font-bold text-ink leading-none mb-2">
                {s.num}
                <span className="text-gold font-bold">{s.unit}</span>
              </div>
              <p className="text-caption text-slate leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="reveal reveal-delay-2 mt-12 max-w-[800px] mx-auto text-[1rem] text-slate leading-[1.5] space-y-3">
          <p className="font-heading text-[1.25rem] text-ink">졸업 산출물 및 커리어 지원</p>
          <p>
            조원희 부트캠프장(법무법인 디엘지 대표변호사) 주도로 Personal Portfolio Book 완성을 위한 1:1 강평·피드백을
            제공하며, 검증된 수료생은 리걸크루 인재 DB에 우선 등록되어 채용·파트너십 기회와 연계될 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
