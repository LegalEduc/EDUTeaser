"use client";

export default function StorySection() {
  return (
    <section className="bg-cream py-[clamp(80px,10vw,140px)]">
      <div className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)]">
        <div className="max-w-[860px]">
          <h2 className="text-[clamp(24px,3vw,38px)] font-bold text-ink leading-[1.35] tracking-[-0.03em] mb-4">
            현장 중심 실무를
            <br />
            <span className="text-ink/25">관통하는</span>
            <br />
            <span className="text-gold">완성형</span>
            <br />
            변호사 양성
          </h2>

          <p className="text-[1.05rem] text-slate leading-[2] font-normal tracking-[0.18px] mb-10">
            시험형 사고를 넘어
            <br />
            실무 현장을 주도하는
            <br />
            변호사를 만듭니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-cream-dark bg-white/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.12px] uppercase text-gold">
                  01
                </span>
                <span className="text-[18px]">⚖️</span>
                <p className="text-[18px] font-bold text-ink leading-[1.3]">
                  실무적 관점의
                  <br />
                  정립
                </p>
              </div>
              <p className="text-[1.02rem] text-slate leading-[1.8] font-normal tracking-[0.18px]">
                시험형 사고에서 탈피하여, 의뢰인의 실질적 문제를 해결하는 '비즈니스 해결사'로 마인드셋을 전환합니다.
              </p>
            </div>

            <div className="rounded-2xl border border-cream-dark bg-white/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.12px] uppercase text-gold">
                  02
                </span>
                <span className="text-[18px]">🎯</span>
                <p className="text-[18px] font-bold text-ink leading-[1.3]">
                  사건 주도권
                  <br />
                  확보
                </p>
              </div>
              <p className="text-[1.02rem] text-slate leading-[1.8] font-normal tracking-[0.18px]">
                수동적인 문서 작성자에 머물지 않고, 소송의 전체 판세를 설계하는 '쟁점 설계자'로 성장시킵니다.
              </p>
            </div>

            <div className="rounded-2xl border border-cream-dark bg-white/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-semibold tracking-[0.12px] uppercase text-gold">
                  03
                </span>
                <span className="text-[18px]">🗺️</span>
                <p className="text-[18px] font-bold text-ink leading-[1.3]">
                  커리어 로드맵
                  <br />
                  구축
                </p>
              </div>
              <p className="text-[1.02rem] text-slate leading-[1.8] font-normal tracking-[0.18px]">
                3년·5년·10년 차의 전문 영역 확립 및 퍼스널 브랜딩을 주도적으로 설계하는 능력을 배양합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
