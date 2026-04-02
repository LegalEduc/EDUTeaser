"use client";

export default function Nav({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-4 px-[clamp(24px,5vw,64px)] border-b border-cream-dark bg-white/95 backdrop-blur-md shadow-airtable-soft"
    >
      <a
        href="#"
        className="inline-flex items-center no-underline"
        aria-label="LegalCrew 홈"
      >
        <img
          src="/legalcrew-logo.png"
          alt="LegalCrew"
          className="h-12 md:h-14 w-auto max-w-[min(360px,60vw)] object-contain object-left"
        />
      </a>
      <button
        onClick={onApplyClick}
        className="text-[1rem] font-medium tracking-[0.08px] uppercase px-5 py-2.5 rounded-[12px] border border-gold bg-gold text-white cursor-pointer transition-all duration-300 hover:bg-gold-dark shadow-airtable shrink-0"
      >
        마스터 정보 등록
      </button>
    </nav>
  );
}
