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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="bg-cream py-20 md:py-24 px-6 md:px-12 border-t border-b border-ink/[0.06]">
      <div
        ref={ref}
        className="reveal max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-12 text-center"
      >
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[12px] tracking-[4px] uppercase text-ink/40 mb-3 font-medium">
              {item.label}
            </p>
            <p className="font-heading text-[17px] font-semibold text-ink leading-relaxed">
              {item.value}
            </p>
            <p className="text-[13px] text-ink/40 mt-1 font-light">{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
