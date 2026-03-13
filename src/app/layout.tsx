import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리걸크루 변호사 실전 압축 부트캠프 — The Rookie Camp",
  description: "법조계의 새로운 실무 표준을 정립할 리걸 커리어 멘토를 모십니다. 12주간의 실전 압축 부트캠프.",
  openGraph: {
    title: "LegalCrew Academy — The Rookie Camp",
    description: "법조계의 새로운 실무 표준을 정립할 멘토를 모십니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Serif+KR:wght@300;400;600;700;900&family=Noto+Sans+KR:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
