"use client";

export default function FooterCTA({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <section className="bg-cream py-36 md:py-44 px-6 md:px-12 text-center border-t border-ink/[0.06]">
      <h2 className="font-heading text-ink text-[clamp(26px,5vw,50px)] font-bold mb-10 leading-snug">
        함께 만들어갈
        <br />
        <span className="text-gold">멘토</span>를 기다립니다.
      </h2>
      <button
        onClick={onApplyClick}
        className="inline-block text-[15px] text-ink px-12 py-4 border border-ink/10 rounded-full
                   tracking-wider hover:bg-gold hover:border-gold hover:text-ink transition-all duration-300"
      >
        멘토 참여 신청하기 →
      </button>
    </section>
  );
}
