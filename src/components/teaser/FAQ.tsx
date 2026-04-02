"use client";

import { useState, useEffect, useRef } from "react";

const faqs = [
  {
    q: "강의 자료는 어떻게 제출하나요?",
    a: "동의서 서명 완료 후 별도 안내 이메일을 드립니다.",
  },
  {
    q: "강의 일정 변경이 가능한가요?",
    a: "사전 협의 시 조율 가능합니다. 담당자에게 문의해 주세요.",
  },
  {
    q: "주차는 어떻게 처리되나요?",
    a: "신청 시 주차 필요 여부를 체크해 주시면 당일 주차 등록 처리해 드립니다.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    el.querySelectorAll(".reveal").forEach((child) => obs.observe(child));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-cream-mid py-[clamp(100px,12vw,160px)]">
      <div ref={ref} className="max-w-[1080px] mx-auto px-[clamp(24px,5vw,64px)]">
        {/* 헤더 */}
        <div className="reveal text-center mb-[72px]">
          <span className="inline-flex items-center gap-2 text-[1rem] font-medium tracking-[0.12px] uppercase text-gold mb-3">
            <span className="w-[5px] h-[5px] rounded-full bg-gold shrink-0" />
            FAQ
          </span>
          <h2 className="text-[clamp(28px,3.5vw,44px)] font-bold text-ink tracking-[-0.03em] leading-[1.25] mt-3">
            자주 묻는 질문
          </h2>
        </div>

        {/* FAQ 리스트 */}
        <div className="max-w-[680px] mx-auto">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`reveal ${i > 0 ? `reveal-delay-${i}` : ""} border-b border-cream-dark ${
                i === 0 ? "border-t border-t-cream-dark" : ""
              }`}
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex items-start justify-between w-full py-[26px] bg-transparent border-none cursor-pointer text-left gap-5"
              >
                <span className="text-[1.15rem] font-medium text-ink leading-[1.5] tracking-[-0.01em]">
                  {faq.q}
                </span>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[1rem] shrink-0 mt-0.5 transition-all duration-350 ${
                    openIdx === i
                      ? "rotate-45 bg-gold text-white"
                      : "bg-cream-dark text-slate"
                  }`}
                >
                  +
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-400"
                style={{ maxHeight: openIdx === i ? "400px" : "0px" }}
              >
                <p className="text-[1.05rem] text-slate leading-[1.9] pb-6 font-light">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}

          {/* 문의처 */}
          <div className="mt-12 pt-10 border-t border-cream-dark">
            <p className="text-[1rem] font-medium tracking-[0.12px] uppercase text-gold mb-3.5">
              Contact
            </p>
            <p className="text-[1.1rem] font-medium text-ink mb-1">채다은 변호사 / 강사 관련</p>
            <p className="text-[1.05rem] text-slate font-light leading-[1.8]">
              contact@legalcrew.co.kr
              <br />
              010-4635-2159
              <br />
              강선민 기획이사 / 교육 관련
              <br />
              010-9131-4827
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
