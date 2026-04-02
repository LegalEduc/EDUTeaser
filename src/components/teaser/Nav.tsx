"use client";

import { useEffect, useState } from "react";

export default function Nav({ onApplyClick }: { onApplyClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[200] flex items-center justify-between py-5 px-[clamp(24px,5vw,64px)] transition-all duration-400 border-b border-transparent ${
        scrolled
          ? "bg-white/95 backdrop-blur-[20px] !border-cream-dark shadow-airtable-soft"
          : "bg-transparent"
      }`}
    >
      <a
        href="#"
        className="inline-flex items-center no-underline"
        aria-label="LegalCrew 홈"
      >
        <img
          src="/legalcrew-ci.svg"
          alt="LegalCrew CI"
          className="h-10 w-auto"
        />
      </a>
      <button
        onClick={onApplyClick}
        className={`text-[1rem] font-medium tracking-[0.08px] uppercase px-5 py-2.5 rounded-[12px] border cursor-pointer transition-all duration-300 ${
          scrolled
            ? "text-ink border-cream-dark hover:bg-ink hover:text-white hover:border-ink"
            : "text-white border-white/35 hover:bg-white/12 hover:border-white/65"
        }`}
      >
        멘토 신청하기
      </button>
    </nav>
  );
}
