"use client";

import { useEffect, useRef } from "react";

interface Props {
  theme?: "dark" | "light";
  children: React.ReactNode;
}

export default function StorySection({ theme = "dark", children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add("visible");
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bg = theme === "light" ? "bg-cream text-ink" : "bg-ink text-cream";

  return (
    <section className={`min-h-screen flex items-center justify-center px-6 md:px-12 ${bg}`}>
      <div ref={ref} className="reveal max-w-[900px] text-center">
        {children}
      </div>
    </section>
  );
}
