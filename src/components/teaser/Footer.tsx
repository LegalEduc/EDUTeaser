"use client";

export default function Footer() {
  return (
    <footer className="bg-gold text-white py-14 px-[clamp(24px,5vw,64px)]">
      <div className="max-w-[1136px] mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between pb-10 border-b border-white/10 gap-10">
          <div>
            <a
              href="#"
              className="inline-flex items-center no-underline rounded-full bg-white px-4 py-3 shadow-airtable-soft"
              aria-label="LegalCrew 홈"
            >
              <img
                src="/legalcrew-logo.png"
                alt="LegalCrew"
                className="h-10 md:h-11 w-auto object-contain"
                style={{ backgroundColor: "transparent" }}
              />
            </a>
            <p className="text-[1rem] text-white/50 font-normal mt-2">리걸크루 변호사 실전 압축 부트캠프</p>
          </div>
          <div className="md:text-right">
            <p className="font-heading text-[1.25rem] text-white mb-2.5">부트캠프 & 운영 문의</p>
            <p className="text-[1rem] font-medium text-white mb-1">리걸크루 강선민 이사</p>
            <div className="text-caption text-[#afafaf] font-normal leading-[1.7]">
              <a
                href="mailto:contact@legalcrew.co.kr"
                className="text-[#afafaf] underline underline-offset-2 hover:text-white transition-colors"
              >
                contact@legalcrew.co.kr
              </a>
              <br />
              010-9131-4827
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-7 flex-wrap gap-4">
          <p className="text-caption text-white/35 font-normal">
            &copy; 2026{" "}
            <a
              href="https://www.legalcrew.co.kr"
              className="text-inherit underline underline-offset-2 hover:text-white transition-colors"
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
