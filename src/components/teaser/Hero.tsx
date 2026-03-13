"use client";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 md:px-12 text-center relative overflow-hidden">
      {/* 배경 그라데이션 오브 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[900px] relative z-10">
        <p
          className="inline-block text-[13px] tracking-[5px] uppercase text-gold mb-12"
          style={{ animation: "fadeIn 1s ease 0.2s both" }}
        >
          초빙 안내
        </p>

        <h1
          className="font-heading text-[clamp(30px,5.5vw,60px)] font-black leading-[1.35] mb-8"
          style={{ animation: "fadeUp 1s ease 0.4s both" }}
        >
          법조계의 새로운 실무 표준을
          <br />
          정립할 <em className="not-italic text-gold">멘토</em>를 모십니다
        </h1>

        {/* 골드 라인 디바이더 */}
        <div
          className="mx-auto w-16 h-px bg-gold/40 mb-8"
          style={{ animation: "lineGrow 0.8s ease 0.7s both", transformOrigin: "center" }}
        />

        <p
          className="text-[clamp(15px,2vw,19px)] text-cream/50 font-light leading-loose"
          style={{ animation: "fadeUp 1s ease 0.8s both" }}
        >
          리걸크루 변호사 실전 압축 부트캠프 — The Rookie Camp
        </p>
      </div>

      {/* 스크롤 인디케이터 */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/20"
        style={{ animation: "fadeIn 1s ease 1.5s both" }}
      >
        <span className="text-[11px] tracking-[3px] uppercase">Scroll</span>
        <div className="w-px h-8 bg-cream/20 animate-pulse" />
      </div>
    </section>
  );
}
