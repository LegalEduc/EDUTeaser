"use client";

export default function Hero({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="min-h-screen min-h-[720px] pt-24 md:pt-28 bg-cream flex items-center justify-center text-center relative overflow-hidden">
      <div className="relative z-10 max-w-[1136px] px-[clamp(24px,5vw,64px)] pb-16">
        {/* 상단 타이틀 "[초빙] ..." 삭제 */}

        <h1
          className="font-heading text-[clamp(2rem,5vw,3.25rem)] text-ink leading-[1.23] mb-6"
          style={{ animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.5s both" }}
        >
          법조계 실무 표준을<br />
          한 단계 끌어올려 주실<br />
          마스터를 모십니다!
        </h1>

        <p
          className="text-[clamp(1rem,1.8vw,1.125rem)] font-semibold text-ink mb-5"
          style={{ animation: "fadeUp 0.9s ease 0.85s both" }}
        >
          리걸크루 변호사 실전 압축 부트캠프
        </p>

        <div
          className="text-center max-w-[640px] mx-auto text-[1rem] text-slate leading-[1.5] space-y-4 mb-10"
          style={{ animation: "fadeUp 0.9s ease 1s both" }}
        >
          <p>신규 변호사들이 시험형 사고에서 실무형 사고로 거듭날 수 있도록<br />
            마스터님께서 현장에서 축적해오신 경험과 통찰을 나눠주세요!
          </p>
        </div>

        <span
          className="block w-10 h-px bg-ink mx-auto my-8"
          style={{ animation: "lineGrow 0.6s ease 1.1s both" }}
        />

        <div
          className="flex justify-center flex-wrap gap-2 mb-12"
          style={{ animation: "fadeUp 0.9s ease 1.25s both" }}
        >
          {[
            { strong: "12주", text: "집중 과정" },
            { strong: "1기 50명", text: "제한" },
            { strong: "실무 최적화", text: "커리큘럼" },
            { strong: "매주 화·목", text: "19:00~21:00" },
          ].map((chip, i) => (
            <span
              key={i}
              className="text-caption font-medium text-ink bg-[#efefef] rounded-full py-3.5 px-4 leading-none transition-colors duration-200 hover:shadow-[inset_0_0_0_999px_rgba(0,0,0,0.04)]"
            >
              {chip.strong && <strong className="font-semibold">{chip.strong} </strong>}
              {chip.text}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-center gap-3 flex-wrap"
          style={{ animation: "fadeUp 0.9s ease 1.4s both" }}
        >
          <button
            type="button"
            onClick={onApplyClick}
            className="inline-flex items-center gap-2 min-h-[44px] text-[1rem] font-medium px-3 py-2.5 rounded-full bg-gold text-white border-none cursor-pointer transition-colors duration-200 hover:bg-gold-light shadow-airtable"
          >
            <span>강사 정보 입력하기</span>
            <span className="w-[26px] h-[26px] rounded-full bg-white/15 flex items-center justify-center text-caption">
              &rarr;
            </span>
          </button>
          <a
            href="#curriculum"
            className="inline-flex items-center justify-center min-h-[44px] text-[1rem] font-medium px-3 py-2.5 rounded-full bg-white text-ink border border-ink no-underline cursor-pointer transition-colors duration-200 hover:bg-[#e2e2e2]"
          >
            커리큘럼 보기
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-light"
        style={{ animation: "fadeIn 1s ease 2s both" }}
      >
        <span className="text-caption font-medium text-slate">Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)",
            animation: "scrollPulse 2s ease infinite",
          }}
        />
      </div>
    </section>
  );
}
