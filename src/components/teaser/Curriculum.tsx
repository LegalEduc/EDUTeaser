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

function splitInstructorAffiliation(text: string): { name: string; affiliation: string } | null {
  // 예: "강우찬 수석부장판사 (서울행정법원)"
  const m = text.match(/^(.*?)(?:\s*\((.*)\)\s*)$/);
  if (!m) return null;
  const name = m[1]?.trim();
  const affiliation = m[2]?.trim();
  if (!name || !affiliation) return null;
  // "—" 같은 값은 분리하지 않음
  if (name === "—" || affiliation === "—") return null;
  return { name, affiliation };
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
      className="bg-cream-mid py-[clamp(64px,10vw,96px)] border-t border-cream-dark"
    >
      <div className="mx-auto max-w-[1136px] px-[clamp(24px,5vw,64px)]">
        <div className="reveal mb-12 md:mb-16">
          <span className="mb-3 inline-flex items-center gap-2 text-caption font-medium text-slate">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
            커리큘럼
          </span>
          <h2 className="font-heading text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.22] text-ink">
            24강
            <br />
            커리큘럼 · 강사진
          </h2>
          <div className="mt-4 max-w-[720px] text-[1rem] leading-[1.5] text-slate space-y-3">
            <p>
              1. 커리큘럼 세부 내용은 강의 준비에 도움을 드리고자 마련한 '예시안'입니다.
            </p>
            <p>
              2. 담당하신 과목 범위 내에서 강사님의 전문성과 판단에 따라 구성을 자유롭게 조정 부탁드립니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {parts.map((part, i) => {
            const isOpen = openIdx === i;
            const items = getItems(part.from, part.to);

            return (
              <div
                key={part.name}
                className={`rounded-xl bg-white transition-shadow duration-200 shadow-airtable-soft ${
                  isOpen ? "shadow-airtable" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-4 py-5 text-left text-ink md:px-5 md:py-6"
                  aria-expanded={isOpen}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="shrink-0 text-caption font-semibold text-ink">{part.name}</span>
                    <span className="text-[1.0625rem] font-semibold md:text-[1.125rem]">{part.title}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-caption text-slate sm:inline">{part.range}</span>
                    <span
                      className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border border-ink/15 text-caption transition-all duration-300 ${
                        isOpen ? "rotate-180 border-ink/40 text-ink" : "text-slate-light"
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
                        className="border-t border-[#e2e2e2] py-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[52px_92px_1fr_200px] lg:items-start lg:gap-4">
                          <span className="text-caption font-bold text-ink">
                            {item.no}
                          </span>
                          <span className="text-caption font-normal text-slate lg:pt-0.5">
                            {item.date}
                          </span>
                          <div className="min-w-0 text-caption font-normal leading-[1.5] text-slate">
                            <strong className="mb-1 block font-medium text-ink">
                              {item.part}
                            </strong>
                            {item.desc}
                          </div>
                          <div className="text-caption font-medium leading-[1.5] text-ink lg:border-l lg:border-[#e2e2e2] lg:pl-4">
                            {(() => {
                              const split = splitInstructorAffiliation(item.instructor);
                              if (!split) return item.instructor;
                              return (
                                <>
                                  <span className="block">{split.name}</span>
                                  <span className="block text-slate-light font-normal">
                                    {split.affiliation}
                                  </span>
                                </>
                              );
                            })()}
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
