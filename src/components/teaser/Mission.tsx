"use client";

import { useEffect, useRef } from "react";

const missions = [
  {
    num: "01",
    icon: "\u2696\uFE0F",
    title: "실무적 관점의\n정립",
    desc: "시험형 사고에서 탈피하여, 의뢰인의 실질적 문제를 해결하는 '비즈니스 해결사'로 마인드셋을 전환합니다.",
  },
  {
    num: "02",
    icon: "\uD83C\uDFAF",
    title: "사건 주도권\n확보",
    desc: "수동적인 문서 작성자에 머물지 않고, 소송의 전체 판세를 설계하는 '쟁점 설계자'로 성장시킵니다.",
  },
  {
    num: "03",
    icon: "\uD83D\uDDFA\uFE0F",
    title: "커리어 로드맵\n구축",
    desc: "3년·5년·10년 차의 전문 영역 확립 및 퍼스널 브랜딩을 주도적으로 설계하는 능력을 배양합니다.",
  },
];

export default function Mission() {
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
      { threshold: 0.15 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-gold py-[clamp(100px,12vw,160px)] relative overflow-hidden">
      {/* 장식 원 */}
      <div className="absolute -top-[30%] -right-[8%] w-[500px] h-[500px] rounded-full bg-white/6 pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[5%] w-[360px] h-[360px] rounded-full bg-black/6 pointer-events-none" />

      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)] relative z-10">
        {/* 헤더: 제목 좌측 / 설명 우측 */}
        <div className="reveal flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-10">
          <h2 className="text-[clamp(36px,5vw,62px)] font-extrabold text-white leading-[1.1] tracking-[-0.04em] max-w-[540px]">
            현장 중심 실무를
            <br />
            관통하는 완성형
            <br />
            변호사 양성
          </h2>
          <p className="text-[1.1rem] font-light text-white/72 max-w-[300px] leading-[1.85] md:text-right">
            시험형 사고를 넘어
            <br />
            실무 현장을 주도하는
            <br />
            변호사를 만듭니다.
          </p>
        </div>

        {/* 3열 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {missions.map((m, i) => (
            <div
              key={m.num}
              className={`reveal reveal-delay-${i + 1} bg-white/12 border border-white/22 rounded-[20px] p-10 px-8 transition-all duration-300 backdrop-blur-[4px] hover:bg-white/22 hover:-translate-y-1`}
            >
              <p className="text-[1rem] font-medium tracking-[3px] text-white/40 uppercase mb-5">
                {m.num}
              </p>
              <div className="text-[28px] mb-4">
                {m.icon}
              </div>
              <h3 className="text-[20px] font-bold text-white mb-3 tracking-[-0.02em] leading-[1.35] whitespace-pre-line">
                {m.title}
              </h3>
              <p className="text-[1.05rem] font-light text-white/72 leading-[1.85]">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
