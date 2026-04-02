"use client";

export default function Footer() {
  return (
    <footer className="bg-white py-14 px-[clamp(24px,5vw,64px)] border-t border-cream-dark">
      <div className="max-w-[1080px] mx-auto">
        {/* 상단: 로고 + 연락처 */}
        <div className="flex flex-col md:flex-row items-start justify-between pb-10 border-b border-cream-dark gap-10">
          <div>
            <a
              href="#"
              className="inline-flex items-center no-underline"
              aria-label="LegalCrew 홈"
            >
              <img
                src="/legalcrew-logo.png"
                alt="LegalCrew"
                className="h-12 md:h-14 w-auto object-contain"
                style={{ backgroundColor: "transparent" }}
              />
            </a>
            <p className="text-[1rem] text-slate-light font-light tracking-[0.18px] mt-2">
              리걸크루 변호사 실전 압축 부트캠프
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-[1rem] font-medium tracking-[3px] uppercase text-gold mb-2.5">
              문의
            </p>
            <p className="text-[1.05rem] font-medium text-ink mb-1">강선민 기획이사</p>
            <div className="text-[1rem] text-slate-light font-light leading-[1.7]">
              <a href="mailto:contact@legalcrew.co.kr" className="text-slate-light no-underline hover:text-gold transition-colors">
                contact@legalcrew.co.kr
              </a>
              <br />
              010-9131-4827
            </div>
          </div>
        </div>

        {/* 하단: 카피라이트 */}
        <div className="flex items-center justify-between pt-7 flex-wrap gap-4">
          <p className="text-[1rem] text-slate-light font-light">
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
