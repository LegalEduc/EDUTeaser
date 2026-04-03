import type { Metadata } from "next";
import "./globals.css";
import { getBaseUrl } from "@/lib/base-url";

export const metadata: Metadata = {
  title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
  description:
    "법조계의 새로운 실무 표준을 정립할 마스터를 모십니다. 리걸크루 변호사 실전 압축 부트캠프 1기.",
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
    description: "실무 표준을 함께 세울 마스터를 모십니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "LegalCrew",
    images: [
      {
        url: "/og-image.png?v=20260405-legal-crew-wordmark",
        width: 1024,
        height: 535,
        alt: "Legal Crew",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙",
    description: "실무 표준을 함께 세울 마스터를 모십니다.",
    images: [
      {
        url: "/og-image.png?v=20260405-legal-crew-wordmark",
        width: 1024,
        height: 535,
      },
    ],
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
