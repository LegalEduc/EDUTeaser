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
          ? "bg-cream/94 backdrop-blur-[20px] !border-cream-dark"
          : "bg-transparent"
      }`}
    >
      <a
        href="#"
        className={`font-logo text-[19px] font-normal tracking-[2px] no-underline transition-colors duration-400 ${
          scrolled ? "text-ink" : "text-white"
        }`}
      >
        LegalCrew <em className="italic font-light">Academy</em>
      </a>
      <button
        onClick={onApplyClick}
        className={`text-[11px] font-medium tracking-[1.5px] uppercase px-[22px] py-[10px] rounded-full border-[1.5px] cursor-pointer transition-all duration-300 ${
          scrolled
            ? "text-ink border-black/20 hover:bg-ink hover:text-white hover:border-ink"
            : "text-white border-white/35 hover:bg-white/12 hover:border-white/65"
        }`}
      >
        멘토 신청하기
      </button>
    </nav>
  );
}
