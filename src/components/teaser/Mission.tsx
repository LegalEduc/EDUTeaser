"use client";

import { useEffect, useRef } from "react";

const missions = [
  {
    num: "01",
    title: "실무적 관점의 정립",
    desc: "시험형 사고에서 탈피하여, 의뢰인의 실질적 문제를 해결하는 '비즈니스 해결사'로 마인드셋을 전환합니다.",
  },
  {
    num: "02",
    title: "사건 주도권 확보",
    desc: "수동적인 문서 작성자에 머물지 않고, 소송의 전체 판세를 설계하는 '쟁점 설계자'로 성장시킵니다.",
  },
  {
    num: "03",
    title: "커리어 로드맵 구축",
    desc: "3년·5년·10년 차의 전문 영역 확립 및 퍼스널 브랜딩을 주도적으로 설계하는 능력을 배양합니다.",
  },
];

export default function Mission() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 md:py-36 px-6 md:px-12">
      <div ref={ref} className="reveal">
        <div className="text-center mb-20">
          <p className="text-[13px] tracking-[5px] uppercase text-gold-dark mb-5">
            Mission
          </p>
          <h2 className="font-heading text-[clamp(24px,4vw,40px)] font-bold">
            현장 중심 실무를 관통하는
            <br />
            완성형 변호사 양성
          </h2>
        </div>

        <div className="max-w-[1000px] mx-auto flex flex-col gap-px">
          {missions.map((m) => (
            <div
              key={m.num}
              className="group grid grid-cols-1 md:grid-cols-[64px_200px_1fr] items-center gap-4 md:gap-8
                         bg-white/[0.02] border border-white/[0.04] px-6 md:px-12 py-8 md:py-10
                         hover:bg-white/[0.04] hover:border-gold/10 hover:translate-x-1
                         transition-all duration-400"
            >
              <span className="font-number text-5xl text-gold/15 leading-none group-hover:text-gold/30 transition-colors">
                {m.num}
              </span>
              <h3 className="font-heading text-xl font-bold">{m.title}</h3>
              <p className="text-[14px] text-cream/50 leading-relaxed font-light">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
