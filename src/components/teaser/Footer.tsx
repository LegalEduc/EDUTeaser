"use client";

export default function Footer() {
  return (
    <footer className="bg-cream py-12 px-[clamp(16px,4vw,48px)]">
      <div className="max-w-[1080px] mx-auto">
        <div className="pb-8 border-t border-b border-cream-dark">
          <a
            href="#"
            className="inline-flex items-center no-underline mt-6"
            aria-label="LegalCrew 홈"
          >
            <img
              src="/legalcrew-logo.png"
              alt="LegalCrew"
              className="h-10 md:h-12 w-auto object-contain"
              style={{ backgroundColor: "transparent" }}
            />
          </a>
          <p className="text-[1rem] text-slate-light font-light tracking-[0.18px] mt-2">
            리걸크루 변호사 실전 압축 부트캠프
          </p>
          <p className="mt-6 text-[0.9rem] font-medium tracking-[0.12px] uppercase text-gold">문의</p>
          <p className="text-[1.02rem] font-medium text-ink mt-1">강선민 기획이사</p>
          <p className="text-[1rem] text-slate-light font-light leading-[1.7] mt-1">
            <a href="mailto:contact@legalcrew.co.kr" className="text-slate-light no-underline">
              contact@legalcrew.co.kr
            </a>
            <br />
            010-9131-4827
          </p>
        </div>
        <div className="pt-6">
          <p className="text-[0.95rem] text-slate-light font-light">
            &copy; 2026 <a href="https://www.legalcrew.co.kr" className="text-inherit no-underline" target="_blank" rel="noopener noreferrer">LegalCrew</a>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
