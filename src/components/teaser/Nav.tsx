"use client";

export default function Nav({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-4 px-[clamp(16px,4vw,48px)] border-b border-cream-dark bg-white/95"
    >
      <a
        href="#"
        className="inline-flex items-center no-underline"
        aria-label="LegalCrew 홈"
      >
        <img
          src="/legalcrew-logo.png"
          alt="LegalCrew"
          className="h-10 md:h-12 w-auto max-w-[min(260px,52vw)] object-contain object-left"
        />
      </a>
      <button
        onClick={onApplyClick}
        className="text-[0.9rem] md:text-[1rem] font-medium tracking-[0.08px] uppercase py-1.5 border-0 border-b border-gold bg-transparent text-gold cursor-pointer shrink-0"
      >
        마스터 정보 등록
      </button>
    </nav>
  );
}
