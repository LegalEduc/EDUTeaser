"use client";

export default function Hero({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="h-screen min-h-[720px] bg-dark flex items-center justify-center text-center relative overflow-hidden">
      {/* 배경 글로우 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 10%, rgba(27,97,201,0.12) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 10% 60%, rgba(24,36,54,0.5) 0%, transparent 55%),
            radial-gradient(ellipse 40% 60% at 90% 60%, rgba(24,36,54,0.35) 0%, transparent 55%)
          `,
        }}
      />

      {/* 좌측 수직 골드 라인 */}
      <div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          left: "clamp(24px,5vw,64px)",
          width: "1px",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(27,97,201,0.25) 30%, rgba(27,97,201,0.25) 70%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[900px] px-[clamp(24px,5vw,64px)]">
        <p
          className="text-[clamp(1rem,1.6vw,1.15rem)] font-medium text-gold tracking-[0.12px] mb-10"
          style={{ animation: "fadeIn 0.8s ease 0.3s both" }}
        >
          초빙 안내
        </p>

        <h1
          className="text-[clamp(40px,7vw,88px)] font-bold text-white leading-[1.15] tracking-normal mb-0"
          style={{ animation: "fadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.5s both" }}
        >
          법조계의 새로운
          <br />
          <span className="bg-gradient-to-br from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
            실무 표준
          </span>
          을{" "}
          <span className="font-extralight text-white/55">정립할</span>
          <br />
          멘토를 모십니다
        </h1>

        <span
          className="block w-10 h-px bg-gold mx-auto my-11"
          style={{ animation: "lineGrow 0.6s ease 1.1s both" }}
        />

        <p
          className="text-[clamp(1rem,1.6vw,1.15rem)] font-light text-white/45 tracking-[1px] mb-13 leading-[1.7]"
          style={{ animation: "fadeUp 0.9s ease 1.2s both" }}
        >
          리걸크루 변호사 실전 압축 부트캠프 — The Rookie Camp
        </p>

        {/* 메타 칩 */}
        <div
          className="flex justify-center flex-wrap gap-2.5 mb-13"
          style={{ animation: "fadeUp 0.9s ease 1.4s both" }}
        >
          {[
            { strong: "24강", text: "실전 커리큘럼" },
            { strong: "12주", text: "집중 과정" },
            { strong: "50명+", text: "수강 인원" },
            { strong: null, text: "사법·변시 출신 모두 환영" },
          ].map((chip, i) => (
            <span
              key={i}
              className="text-[1rem] font-normal text-white/45 border border-white/10 rounded-[12px] py-[7px] px-[18px] tracking-[0.08px] transition-all duration-300 hover:border-gold/40 hover:text-white/75"
            >
              {chip.strong && (
                <strong className="text-white/80 font-medium">{chip.strong} </strong>
              )}
              {chip.text}
            </span>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div
          className="flex items-center justify-center gap-4 flex-wrap"
          style={{ animation: "fadeUp 0.9s ease 1.55s both" }}
        >
          <button
            onClick={onApplyClick}
            className="inline-flex items-center gap-2.5 text-[1rem] font-medium tracking-[0.08px] uppercase px-6 py-3.5 rounded-[12px] bg-gold text-white border-none cursor-pointer transition-all duration-300 hover:bg-gold-dark hover:-translate-y-0.5 shadow-airtable hover:shadow-airtable-soft"
          >
            <span>멘토 참여 신청하기</span>
            <span className="w-[26px] h-[26px] rounded-full bg-white/18 flex items-center justify-center text-[1rem]">
              &rarr;
            </span>
          </button>
          <a
            href="#curriculum"
            className="inline-flex items-center gap-2.5 text-[1rem] font-medium tracking-[0.08px] uppercase px-6 py-3.5 rounded-[12px] bg-transparent text-white border border-white/40 no-underline cursor-pointer transition-all duration-300 hover:bg-white/12 hover:border-white/70"
          >
            커리큘럼 보기
          </a>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 text-white/18"
        style={{ animation: "fadeIn 1s ease 2s both" }}
      >
        <span className="text-[1rem] tracking-[4px] uppercase font-normal">Scroll</span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, rgba(45,127,249,0.55), transparent)",
            animation: "scrollPulse 2s ease infinite",
          }}
        />
      </div>
    </section>
  );
}
