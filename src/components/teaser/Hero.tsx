"use client";

export default function Hero({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="min-h-screen min-h-[720px] pt-24 md:pt-28 bg-cream flex items-center justify-center text-center relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(27,97,201,0.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 0% 100%, rgba(248,250,252,1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 40% at 100% 100%, rgba(248,250,252,1) 0%, transparent 50%)
          `,
        }}
      />

      <div
        className="absolute top-24 bottom-0 pointer-events-none hidden md:block"
        style={{
          left: "clamp(24px,5vw,64px)",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(27,97,201,0.2) 30%, rgba(27,97,201,0.2) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[820px] px-[clamp(24px,5vw,64px)] pb-16">
        <p
          className="text-[clamp(0.9rem,1.4vw,1.05rem)] font-semibold text-gold tracking-[0.12px] mb-4"
          style={{ animation: "fadeIn 0.8s ease 0.3s both" }}
        >
          [초빙] 실전 압축 부트캠프
        </p>

        <h1
          className="text-[clamp(1.35rem,4.2vw,2.35rem)] font-bold text-ink leading-[1.35] tracking-normal mb-6"
          style={{ animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.5s both" }}
        >
          법조계의 새로운 실무 표준을 정립할
          <br />
          마스터를 모십니다
        </h1>

        <p
          className="text-[clamp(1.05rem,2vw,1.2rem)] font-semibold text-ink tracking-[0.02em] mb-5"
          style={{ animation: "fadeUp 0.9s ease 0.85s both" }}
        >
          리걸크루 변호사 실전 압축 부트캠프
        </p>

        <div
          className="text-left max-w-[640px] mx-auto text-[1rem] md:text-[1.05rem] text-slate leading-[1.85] tracking-[0.18px] space-y-4 mb-10"
          style={{ animation: "fadeUp 0.9s ease 1s both" }}
        >
          <p>
            변호사님을 리걸크루 변호사 실전 압축 부트캠프 마스터로 정중히 모십니다.
          </p>
          <p>
            본 과정을 통해 신규 변호사들이 실무 투입 즉시 성과를 창출하는 ‘완성형 에이스’로 양성될 수 있도록
            현장에서 축적해오신 실무 경험과 통찰을 나눠주세요!
          </p>
        </div>

        <span
          className="block w-10 h-px bg-gold mx-auto my-8"
          style={{ animation: "lineGrow 0.6s ease 1.1s both" }}
        />

        <div
          className="flex justify-center flex-wrap gap-2.5 mb-12"
          style={{ animation: "fadeUp 0.9s ease 1.25s both" }}
        >
          {[
            { strong: "24강", text: "확정 커리큘럼" },
            { strong: "12주", text: "집중 과정" },
            { strong: "1기 50명", text: "제한" },
            { strong: null, text: "화·목 저녁 오프라인" },
          ].map((chip, i) => (
            <span
              key={i}
              className="text-[1rem] font-normal text-slate border border-cream-dark bg-white rounded-[12px] py-[7px] px-[18px] tracking-[0.08px] transition-all duration-300 hover:border-gold/35 hover:text-ink"
            >
              {chip.strong && (
                <strong className="text-ink font-medium">{chip.strong} </strong>
              )}
              {chip.text}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-4 flex-wrap"
          style={{ animation: "fadeUp 0.9s ease 1.4s both" }}
        >
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2.5 text-[1rem] font-medium tracking-[0.08px] uppercase px-6 py-3.5 rounded-[12px] bg-gold text-white border-none cursor-pointer transition-all duration-300 hover:bg-gold-dark hover:-translate-y-0.5 shadow-airtable hover:shadow-airtable-soft"
          >
            <span>마스터 참여 신청하기</span>
            <span className="w-[26px] h-[26px] rounded-full bg-white/20 flex items-center justify-center text-[1rem]">
              &rarr;
            </span>
          </button>
          <a
            href="#curriculum"
            className="inline-flex items-center gap-2.5 text-[1rem] font-medium tracking-[0.08px] uppercase px-6 py-3.5 rounded-[12px] bg-white text-ink border border-cream-dark no-underline cursor-pointer transition-all duration-300 hover:border-gold/40 hover:bg-cream-mid"
          >
            커리큘럼 보기
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 text-slate-light"
        style={{ animation: "fadeIn 1s ease 2s both" }}
      >
        <span className="text-[1rem] tracking-[0.12px] uppercase font-medium">Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, rgba(27,97,201,0.45), transparent)",
            animation: "scrollPulse 2s ease infinite",
          }}
        />
      </div>
    </section>
  );
}
