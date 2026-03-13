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
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-28 md:py-36 px-6 md:px-12 border-t border-white/[0.04]">
      <div ref={ref} className="reveal max-w-[640px] mx-auto">
        <div className="text-center mb-16">
          <p className="text-[13px] tracking-[5px] uppercase text-gold-dark mb-5">
            FAQ
          </p>
          <h2 className="font-heading text-[clamp(24px,4vw,36px)] font-bold">
            자주 묻는 질문
          </h2>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/[0.05]">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex items-center justify-between w-full py-6 text-left"
              >
                <span className="text-base font-medium pr-4">{faq.q}</span>
                <span
                  className={`text-lg text-gold-dark shrink-0 transition-transform duration-300 ${
                    openIdx === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              <div className={`accordion-body ${openIdx === i ? "open" : ""}`}>
                <div>
                  <p className="pb-6 text-[14px] text-muted leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 문의처 */}
        <div className="mt-16 text-center p-10 border border-white/[0.05]">
          <h4 className="font-heading text-lg mb-5">문의처</h4>
          <p className="text-[14px] text-muted font-light mb-1.5">담당자: 강선민 이사</p>
          <p className="text-[14px] text-muted font-light mb-1.5">
            이메일: cs@legalcrew.co.kr
          </p>
          <p className="text-[14px] text-muted font-light">전화: 010-0000-0000</p>
        </div>
      </div>
    </section>
  );
}
