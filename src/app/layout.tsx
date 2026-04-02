import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
  description:
    "법조계의 새로운 실무 표준을 정립할 마스터를 모십니다. 리걸크루 변호사 실전 압축 부트캠프 1기.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://academy.legalcrew.co.kr"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
    description: "실무 표준을 함께 세울 마스터를 모십니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "LegalCrew",
  },
  twitter: {
    card: "summary_large_image",
    title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
    description: "실무 표준을 함께 세울 마스터를 모십니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
