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
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 transition-all duration-500 ${
        scrolled ? "bg-ink/90 backdrop-blur-xl" : ""
      }`}
    >
      <a href="#" className="font-logo text-xl font-bold tracking-[1.5px] text-cream">
        LegalCrew <span className="font-normal italic opacity-70">Academy</span>
      </a>
      <button
        onClick={onApplyClick}
        className="text-[13px] text-cream px-7 py-2.5 border border-cream/20 rounded-full tracking-wider
                   hover:bg-gold hover:border-gold hover:text-ink transition-all duration-300"
      >
        멘토 신청
      </button>
    </nav>
  );
}
