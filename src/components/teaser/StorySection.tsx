"use client";

import { useEffect, useRef } from "react";

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

          {/* 왼쪽: 문제 정의 */}
          <div ref={leftRef} className="reveal md:pr-[60px] relative">
            {/* 수직 구분선 (PC only) */}
            <div className="hidden md:block absolute right-0 top-[5%] h-[90%] w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent" />

            <p className="text-[10px] font-medium tracking-[4px] uppercase text-slate-light mb-7">
              The Problem
            </p>
            <h2 className="text-[clamp(24px,3vw,38px)] font-bold text-ink leading-[1.35] tracking-[-0.03em] mb-6">
              합격 이후에도
              <br />
              <span className="text-ink/25">실무 현장의</span>
              <br />
              <span className="text-gold">장벽은 높습니다</span>
            </h2>
            <p className="text-[14px] text-slate leading-[2] font-light">
              로스쿨을 졸업하고, 변호사 시험을 통과해도,
              <br />
              실무 현장의 장벽은 여전히 높습니다.
              <br /><br />
              정형화되지 않은 실무. 경험적 데이터의 부재.
            </p>
          </div>

          {/* 오른쪽: 해결 방향 */}
          <div ref={rightRef} className="reveal reveal-delay-2 md:pl-[60px]">
            <p className="text-[10px] font-medium tracking-[4px] uppercase text-slate-light mb-7">
              Our Answer
            </p>
            <h2 className="text-[clamp(24px,3vw,38px)] font-bold text-ink leading-[1.35] tracking-[-0.03em] mb-6">
              그 단절을 메울
              <br />
              <span className="text-gold">리걸 커리어 멘토</span>가
              <br />
              필요합니다
            </h2>
            <p className="text-[14px] text-slate leading-[2] font-light">
              변호사님의 현장 경험과 통찰을 신규 변호사들에게 나눠주세요.
            </p>
            <ul className="list-none mt-8 flex flex-col gap-4">
              <li className="flex items-start gap-3.5 text-[14px] text-slate leading-[1.7] font-light">
                <span className="w-[22px] h-[22px] rounded-full bg-gold/8 border border-gold/25 flex items-center justify-center text-[11px] shrink-0 mt-0.5 text-gold">
                  &#10003;
                </span>
                <span>
                  실전 1년 차의 생존 전략을 집약적으로 전수하는 12주간의 부트캠프를 함께 만들어갑니다.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
