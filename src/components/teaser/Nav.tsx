"use client";

export default function Nav({ onApplyClick }: { onApplyClick: () => void }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-3 px-[clamp(24px,5vw,64px)] border-b border-cream-dark bg-white/95 backdrop-blur-md">
      <a href="#" className="inline-flex items-center no-underline" aria-label="LegalCrew 홈">
        <img
          src="/legalcrew-logo.png"
          alt="LegalCrew"
          className="h-12 md:h-14 w-auto max-w-[min(360px,60vw)] object-contain object-left"
        />
      </a>
      <button
        type="button"
        onClick={onApplyClick}
        className="text-[1rem] font-medium min-h-[44px] px-3 py-2.5 rounded-full bg-gold text-white border-none cursor-pointer transition-colors duration-200 hover:bg-gold-light shadow-airtable shrink-0"
      >
        마스터 정보 등록
      </button>
    </nav>
  );
}
