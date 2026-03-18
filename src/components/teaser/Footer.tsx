"use client";

export default function Footer() {
  return (
    <footer className="bg-ink py-14 px-[clamp(24px,5vw,64px)]">
      <div className="max-w-[1080px] mx-auto">
        {/* 상단: 로고 + 연락처 */}
        <div className="flex flex-col md:flex-row items-start justify-between pb-10 border-b border-white/7 gap-10">
          <div>
            <a
              href="#"
              className="font-logo text-[20px] font-normal tracking-[2px] text-white no-underline"
            >
              LegalCrew <em className="italic font-light">Academy</em>
            </a>
            <p className="text-[12px] text-white/30 font-light tracking-[0.5px] mt-2">
              변호사 실전 압축 부트캠프 — The Rookie Camp
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] font-medium tracking-[3px] uppercase text-gold mb-2.5">
              Contact
            </p>
            <p className="text-[14px] font-medium text-white mb-1">강선민 이사</p>
            <div className="text-[13px] text-white/35 font-light leading-[1.7]">
              <a href="mailto:contact@legalcrew.co.kr" className="text-white/35 no-underline hover:text-gold transition-colors">
                contact@legalcrew.co.kr
              </a>
              <br />
              010-0000-0000
            </div>
          </div>
        </div>

        {/* 하단: 카피라이트 */}
        <div className="flex items-center justify-between pt-7 flex-wrap gap-4">
          <p className="text-[12px] text-white/20 font-light">
            &copy; 2026{" "}
            <a
              href="https://www.legalcrew.co.kr"
              className="text-inherit no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LegalCrew
            </a>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
