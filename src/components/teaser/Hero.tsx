"use client";

export default function Hero({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="pt-28 md:pt-32 pb-16 md:pb-24 bg-cream border-b border-cream-dark">
      <div className="max-w-[1080px] mx-auto px-[clamp(16px,4vw,48px)]">
        <p className="text-[0.95rem] font-medium text-gold tracking-[0.12px] mb-4">
          [초빙] 실전 압축 부트캠프
        </p>
        <h1 className="font-heading text-[clamp(1.8rem,5vw,3.6rem)] font-medium text-ink leading-[1.2] tracking-normal mb-7">
          법조계의 새로운 실무 표준을 정립할
          <br />
          마스터를 모십니다
        </h1>
        <p className="text-[1.05rem] font-medium text-ink tracking-[0.08px] mb-8">
          리걸크루 변호사 실전 압축 부트캠프
        </p>
        <div className="border-t border-cream-dark pt-8 max-w-[820px]">
          <div className="text-left text-[1rem] md:text-[1.05rem] text-slate leading-[1.85] tracking-[0.18px] space-y-4 mb-10">
            <p>
              변호사님을 리걸크루 변호사 실전 압축 부트캠프 마스터로 정중히 모십니다.
            </p>
            <p>
              본 과정을 통해 신규 변호사들이 실무 투입 즉시 성과를 창출하는 ‘완성형 에이스’로 양성될 수 있도록
              현장에서 축적해오신 실무 경험과 통찰을 나눠주세요!
            </p>
          </div>
          <ul className="border-t border-cream-dark text-[0.98rem] text-slate tracking-[0.08px]">
            <li className="py-3 border-b border-cream-dark"><strong className="text-ink font-medium">24강</strong> 확정 커리큘럼</li>
            <li className="py-3 border-b border-cream-dark"><strong className="text-ink font-medium">12주</strong> 집중 과정</li>
            <li className="py-3 border-b border-cream-dark"><strong className="text-ink font-medium">1기 50명</strong> 제한</li>
            <li className="py-3 border-b border-cream-dark">화·목 저녁 오프라인</li>
          </ul>
        </div>
        <div className="mt-8 flex items-center gap-6 flex-wrap">
          <button
            onClick={onApplyClick}
            className="text-[1rem] font-medium tracking-[0.08px] border-0 border-b border-gold text-gold bg-transparent py-1 cursor-pointer"
          >
            마스터 참여 신청하기
          </button>
          <a
            href="#curriculum"
            className="text-[1rem] font-medium tracking-[0.08px] border-0 border-b border-cream-dark text-ink no-underline py-1"
          >
            커리큘럼 보기
          </a>
        </div>
      </div>
    </section>
  );
}
