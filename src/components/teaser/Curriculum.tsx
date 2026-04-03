"use client";

import { useState, useEffect, useRef } from "react";
import { curriculum } from "@/data/curriculum";

const parts = [
  { name: "Part 1", title: "마인드셋 · 커뮤니케이션", range: "1 – 2강", from: 1, to: 2 },
  { name: "Part 2", title: "형사 수사 · 공판", range: "3 – 6강", from: 3, to: 6 },
  { name: "Part 3", title: "민사 · 행정", range: "7 – 10강", from: 7, to: 10 },
  { name: "Part 4", title: "커리어 · 가사 · 집행", range: "11 – 14강", from: 11, to: 14 },
  { name: "Part 5", title: "특수 분야 · 문서 · 계약", range: "15 – 18강", from: 15, to: 18 },
  { name: "Part 6", title: "영문 계약 · AI · 수료", range: "19 – 24강", from: 19, to: 24 },
];

function getItems(from: number, to: number) {
  return curriculum.filter((_, i) => i >= from - 1 && i <= to - 1);
}

export default function Curriculum() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="curriculum"
      ref={sectionRef}
      className="bg-cream-mid py-[clamp(100px,12vw,160px)] border-t border-cream-dark"
    >
      <div className="mx-auto max-w-[1080px] px-[clamp(24px,5vw,64px)]">
        <div className="reveal mb-12 md:mb-16">
          <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12px] text-gold">
            <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-gold" />
            커리큘럼
          </span>
          <h2 className="text-[clamp(32px,4.5vw,56px)] font-bold leading-[1.25] tracking-normal text-ink">
            24강
            <br />
            커리큘럼 · 강사진
          </h2>
          <p className="mt-4 max-w-[720px] text-[0.95rem] leading-[1.65] text-slate tracking-[0.18px]">
            파트 및 주요 학습 내용은 강의 준비 지원을 위한 예시안입니다. 과목 범위 내에서 강사님의 전문성과 판단에 따라
            구성을 자유롭게 조정하실 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {parts.map((part, i) => {
            const isOpen = openIdx === i;
            const items = getItems(part.from, part.to);

            return (
              <div
                key={part.name}
                className={`rounded-2xl border border-cream-dark bg-white transition-shadow duration-200 ${
                  i > 0 ? "" : ""
                } ${isOpen ? "shadow-airtable-soft" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-4 py-5 text-left text-ink md:px-5 md:py-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="shrink-0 text-[13px] font-semibold uppercase tracking-[0.12px] text-gold">
                      {part.name}
                    </span>
                    <span className="text-[17px] font-semibold tracking-normal md:text-[18px]">{part.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-[11px] tracking-[0.08px] text-slate-light sm:inline">{part.range}</span>
                    <span
                      className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border text-[11px] transition-all duration-300 ${
                        isOpen ? "rotate-180 border-gold/45 text-gold" : "border-cream-dark text-slate-light"
                      }`}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                <div
                  className="overflow-hidden transition-[max-height] duration-300 ease-out"
                  style={{ maxHeight: isOpen ? 2000 : 0 }}
                  aria-hidden={!isOpen}
                >
                  <div className="space-y-0 px-4 pb-5 pt-0 md:px-5 md:pb-6">
                    {items.map((item) => (
                      <div
                        key={item.no}
                        className="border-t border-cream-dark py-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[52px_92px_1fr_200px] lg:items-start lg:gap-4">
                          <span className="text-[12px] font-bold tracking-[0.08px] text-gold">
                            {item.no}
                          </span>
                          <span className="text-[12px] font-normal text-slate-light lg:pt-0.5">
                            {item.date}
                          </span>
                          <div className="min-w-0 text-[13px] font-light leading-[1.75] tracking-[0.18px] text-slate">
                            <strong className="mb-1 block font-medium text-ink">
                              {item.part}
                            </strong>
                            {item.desc}
                          </div>
                          <div className="text-[12px] font-medium leading-[1.5] text-ink lg:border-l lg:border-cream-dark lg:pl-4">
                            {item.instructor}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
