"use client";

import { useState, useEffect, useRef } from "react";
import { curriculum } from "@/data/curriculum";

interface Part {
  name: string;
  title: string;
  range: string;
  items: typeof curriculum;
}

const parts: Part[] = [
  {
    name: "Part 1",
    title: "마인드셋 \u00B7 기초 역량",
    range: "1 \u2013 2강",
    items: curriculum.filter((c) => ["1강", "2강"].includes(c.no)),
  },
  {
    name: "Part 2",
    title: "형사 수사 \u00B7 공판",
    range: "3 \u2013 6강",
    items: curriculum.filter((c) => ["3강", "4강", "5강", "6강"].includes(c.no)),
  },
  {
    name: "Part 3",
    title: "민사 소송 \u00B7 집행",
    range: "7 \u2013 13강",
    items: curriculum.filter((c) =>
      ["7강", "8강", "9강", "10강", "11강", "12강", "13강"].includes(c.no)
    ),
  },
  {
    name: "Part 4",
    title: "특수 분야 실무",
    range: "14 \u2013 15강",
    items: curriculum.filter((c) => ["14강", "15강"].includes(c.no)),
  },
  {
    name: "Part 5",
    title: "문서 \u00B7 계약 실무",
    range: "16 \u2013 18강",
    items: curriculum.filter((c) => ["16강", "17강", "18강"].includes(c.no)),
  },
  {
    name: "Part 6",
    title: "AI \u00B7 리서치 \u00B7 커리어",
    range: "19 \u2013 24강",
    items: curriculum.filter((c) =>
      ["19강", "20강", "21강", "22강", "23강", "24강"].includes(c.no)
    ),
  },
];

export default function Curriculum() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
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
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  const togglePart = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="curriculum" className="bg-dark py-[clamp(100px,12vw,160px)]">
      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)]">
        {/* 헤더 */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 text-[10px] font-medium tracking-[4px] uppercase text-gold/70 mb-4">
              <span className="w-[5px] h-[5px] rounded-full bg-gold/70 shrink-0" />
              Curriculum
            </span>
            <h2 className="text-[clamp(32px,4.5vw,56px)] font-extrabold text-white tracking-[-0.04em] leading-[1.15]">
              24강
              <br />
              커리큘럼
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-[14px] font-light text-white/40 leading-[1.8] max-w-[320px] md:text-right max-md:max-w-none">
            형사부터 AI 실무까지.
            <br />
            현장에서 바로 쓸 수 있는
            <br className="hidden md:block" />
            지식만 담았습니다.
          </p>
        </div>

        {/* PART 아코디언 */}
        <div className="flex flex-col gap-px">
          {parts.map((part, i) => (
            <div
              key={part.name}
              className={`reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ""} rounded-[12px] border transition-colors duration-250 ${
                openIdx === i
                  ? "bg-white/5 border-white/6"
                  : "bg-white/3 border-white/6 hover:bg-white/5"
              }`}
            >
              {/* 헤더 */}
              <button
                onClick={() => togglePart(i)}
                className="flex items-center justify-between w-full py-6 px-5 md:px-7 cursor-pointer select-none text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[13px] font-semibold tracking-[3px] uppercase text-gold">
                    {part.name}
                  </span>
                  <span className="text-[18px] max-md:text-[16px] font-semibold text-white tracking-[-0.01em]">
                    {part.title}
                  </span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="text-[11px] font-normal text-white/30 tracking-[1.5px]">
                    {part.range}
                  </span>
                  <span
                    className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center text-[11px] shrink-0 transition-all duration-350 ${
                      openIdx === i
                        ? "rotate-180 border-gold/40 text-gold"
                        : "border-white/10 text-white/35"
                    }`}
                  >
                    &#9662;
                  </span>
                </div>
              </button>

              {/* 본문 */}
              <div className={`part-body ${openIdx === i ? "open" : ""}`}>
                <div className="px-5 md:px-7 pb-6">
                  {part.items.map((item) => (
                    <div
                      key={item.no}
                      className="grid grid-cols-[48px_72px_1fr] max-md:grid-cols-[40px_1fr] items-baseline py-3.5 border-t border-white/5 gap-4"
                    >
                      <span className="text-[12px] font-bold text-gold tracking-[0.5px]">
                        {item.no}
                      </span>
                      <span className="text-[12px] text-white/30 font-light max-md:hidden">
                        {item.date}
                      </span>
                      <div className="text-[13px] text-white/60 leading-[1.75] font-light">
                        <strong className="font-medium text-white/85 block mb-0.5">
                          {item.part}
                        </strong>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
