"use client";

import { useState, useEffect, useRef } from "react";
import { curriculum } from "@/data/curriculum";

export default function Curriculum() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 border-t border-white/[0.04]">
      <div ref={ref} className="reveal">
        <div className="max-w-[960px] mx-auto text-center mb-16">
          <p className="text-[13px] tracking-[5px] uppercase text-gold-dark mb-5">
            Curriculum
          </p>
          <h2 className="font-heading text-[clamp(24px,4vw,40px)] font-bold mb-4">
            세부 커리큘럼
          </h2>
          <p className="text-base text-muted font-light">
            총 24강, 실무 현장을 관통하는 체계적 교육 과정
          </p>
        </div>

        <div className="max-w-[960px] mx-auto">
          {/* PC 테이블 */}
          <div className="hidden md:block">
            {curriculum.map((item) => (
              <div
                key={item.no}
                className="grid grid-cols-[56px_90px_150px_1fr] py-5 border-b border-white/[0.04]
                           hover:bg-white/[0.015] hover:-mx-5 hover:px-5 transition-all duration-200 items-baseline"
              >
                <span className="font-number text-[15px] text-gold-dark">
                  {item.no}
                </span>
                <span className="text-[14px] text-muted">{item.date}</span>
                <span className="text-[14px] font-semibold">{item.part}</span>
                <span className="text-[13px] text-cream/50 leading-relaxed font-light">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          {/* 모바일 아코디언 */}
          <div className="md:hidden">
            {curriculum.map((item, i) => (
              <div key={item.no} className="border-b border-white/[0.04]">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="flex items-center justify-between w-full py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-number text-[14px] text-gold-dark min-w-[32px]">
                      {item.no}
                    </span>
                    <span className="text-[14px] font-semibold">{item.part}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-muted">{item.date}</span>
                    <span
                      className={`text-[13px] text-muted transition-transform duration-300 ${
                        openIdx === i ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </div>
                </button>
                <div className={`accordion-body ${openIdx === i ? "open" : ""}`}>
                  <div>
                    <p className="pb-4 pl-11 text-[13px] text-cream/50 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
