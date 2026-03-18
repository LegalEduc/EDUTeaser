"use client";

import { useState, useEffect, useRef } from "react";
import { curriculum } from "@/data/curriculum";

const parts = [
  { name: "Part 1", title: "마인드셋 · 기초 역량", range: "1 – 2강", from: 1, to: 2 },
  { name: "Part 2", title: "형사 수사 · 공판", range: "3 – 6강", from: 3, to: 6 },
  { name: "Part 3", title: "민사 소송 · 집행", range: "7 – 13강", from: 7, to: 13 },
  { name: "Part 4", title: "특수 분야 실무", range: "14 – 15강", from: 14, to: 15 },
  { name: "Part 5", title: "문서 · 계약 실무", range: "16 – 18강", from: 16, to: 18 },
  { name: "Part 6", title: "AI · 리서치 · 커리어", range: "19 – 24강", from: 19, to: 24 },
];

function getItems(from: number, to: number) {
  return curriculum.filter((_, i) => i >= from - 1 && i <= to - 1);
}

export default function Curriculum() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // reveal 애니메이션
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="curriculum"
      ref={sectionRef}
      style={{ background: "#0f0f1a", padding: "clamp(100px,12vw,160px) 0" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(24px,5vw,64px)" }}>
        {/* 헤더 */}
        <div className="reveal" style={{ marginBottom: 64 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(196,153,60,0.7)",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(196,153,60,0.7)" }} />
            Curriculum
          </span>
          <h2
            style={{
              fontSize: "clamp(32px,4.5vw,56px)",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
            }}
          >
            24강<br />커리큘럼
          </h2>
        </div>

        {/* 아코디언 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {parts.map((part, i) => {
            const isOpen = openIdx === i;
            const items = getItems(part.from, part.to);

            return (
              <div
                key={part.name}
                className={`reveal ${i > 0 ? `reveal-delay-${Math.min(i, 3)}` : ""}`}
                style={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: isOpen ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
                  transition: "background 0.25s ease",
                }}
              >
                {/* 버튼 */}
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: "24px 20px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        color: "#c4993c",
                      }}
                    >
                      {part.name}
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
                      {part.title}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5 }}>
                      {part.range}
                    </span>
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        border: isOpen ? "1px solid rgba(196,153,60,0.4)" : "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: isOpen ? "#c4993c" : "rgba(255,255,255,0.35)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* 본문 — 인라인 스타일로 확실하게 */}
                <div
                  style={{
                    maxHeight: isOpen ? 1200 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div style={{ padding: "0 20px 24px" }}>
                    {items.map((item) => (
                      <div
                        key={item.no}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "48px 72px 1fr",
                          alignItems: "baseline",
                          padding: "14px 0",
                          borderTop: "1px solid rgba(255,255,255,0.05)",
                          gap: 16,
                        }}
                      >
                        <span style={{ color: "#c4993c", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>
                          {item.no}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 300 }}>
                          {item.date}
                        </span>
                        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.75, fontWeight: 300 }}>
                          <strong style={{ color: "rgba(255,255,255,0.85)", fontWeight: 500, display: "block", marginBottom: 2 }}>
                            {item.part}
                          </strong>
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
