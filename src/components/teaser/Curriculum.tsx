"use client";

import { useEffect, useRef } from "react";
import { curriculum } from "@/data/curriculum";

export default function Curriculum() {
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
      className="bg-cream py-[clamp(80px,10vw,120px)] border-b border-cream-dark"
    >
      <div className="mx-auto max-w-[1080px] px-[clamp(16px,4vw,48px)]">
        <div className="reveal mb-10">
          <h2 className="font-heading text-[clamp(28px,4vw,44px)] font-medium leading-[1.25] tracking-normal text-ink">
            24강 커리큘럼 · 강사진
          </h2>
          <ul className="mt-3 text-[0.98rem] leading-[1.75] text-slate tracking-[0.18px] list-disc pl-5 space-y-1">
            <li>아래 명시된 커리큘럼 세부 정보는 강의 준비를 위해 마련한 &#39;예시안&#39;입니다.</li>
            <li>강사님의 전문성과 판단에 따라 과목 내용을 자유롭게 구성하실 수 있습니다.</li>
            <li>1~2년차 변호사들이 실전에서 헤매기 쉬운 포인트를 중심으로 강의안을 구성해 주세요.</li>
          </ul>
        </div>

        <div className="border-t border-cream-dark">
          {curriculum.map((item) => (
            <div key={item.no} className="py-4 border-b border-cream-dark">
              <p className="text-[0.9rem] font-medium tracking-[0.08px] text-gold">
                {item.no} · {item.date}
              </p>
              <p className="mt-1 text-[1.08rem] font-medium leading-[1.5] text-ink">{item.part}</p>
              <p className="mt-1 text-[0.98rem] font-light leading-[1.75] tracking-[0.18px] text-slate">
                {item.desc}
              </p>
              <p className="mt-1 text-[0.92rem] font-medium leading-[1.6] text-ink">{item.instructor}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
