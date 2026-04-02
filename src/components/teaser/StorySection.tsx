"use client";

import { useEffect, useRef } from "react";

const goals = [
  <>실무적 관점의 정립: 학계의 &apos;시험형 사고&apos;에서 탈피하여, 의뢰인의 실질적 문제를 해결하는 &apos;비즈니스 해결사&apos;로 마인드셋을 전환합니다.</>,
  <>사건 주도권 확보: 수동적인 문서 작성자에 머물지 않고, 소송의 전체 판세를 설계하는 &apos;쟁점 설계자&apos;로 성장시킵니다.</>,
  <>커리어 로드맵 구축: 3년·5년·10년 차의 전문 영역 확립 및 퍼스널 브랜딩을 주도적으로 설계하는 능력을 배양합니다.</>,
];

export default function StorySection() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.25 }
    );
    if (leftRef.current) obs.observe(leftRef.current);
    if (rightRef.current) obs.observe(rightRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-cream py-[clamp(100px,12vw,160px)]">
      <div className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 relative">

          <div ref={leftRef} className="reveal md:pr-[60px] relative">
            <div className="hidden md:block absolute right-0 top-[5%] h-[90%] w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />

            <p className="text-[1rem] font-medium tracking-[0.12px] uppercase text-slate-light mb-7">
              기획 취지
            </p>
            <h2 className="text-[clamp(24px,3vw,38px)] font-bold text-ink leading-[1.35] tracking-[-0.03em] mb-6">
              현장 중심 실무를
              <br />
              <span className="text-ink/25">관통하는</span>
              <br />
              <span className="text-gold">완성형 변호사 양성</span>
            </h2>
            <p className="text-[1.05rem] text-slate leading-[1.9] font-normal tracking-[0.18px]">
              로스쿨 교육과 변호사 시험을 통과했어도 실무 현장의 장벽은 높습니다. 정형화되지 않은 실무에서의 경험적 데이터
              부재는 주니어 변호사의 직무 위축으로 이어지기 쉽습니다. 본 부트캠프는 이러한 단절을 메우고 &lsquo;실전 1년
              차의 생존 전략&rsquo;을 집약적으로 전수합니다.
            </p>
          </div>

          <div ref={rightRef} className="reveal reveal-delay-2 md:pl-[60px]">
            <p className="text-[1rem] font-medium tracking-[0.12px] uppercase text-slate-light mb-7">
              프로그램 목표
            </p>
            <h2 className="text-[clamp(24px,3vw,38px)] font-bold text-ink leading-[1.35] tracking-[-0.03em] mb-6">
              마스터와 함께하는
              <br />
              <span className="text-gold">구체적 역량 목표</span>
            </h2>
            <ul className="list-none mt-2 flex flex-col gap-4">
              {goals.map((text, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3.5 text-[1.02rem] text-slate leading-[1.75] font-normal tracking-[0.18px]"
                >
                  <span className="w-[22px] h-[22px] rounded-full bg-gold/8 border border-gold/25 flex items-center justify-center text-[0.85rem] shrink-0 mt-0.5 text-gold">
                    &#10003;
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
