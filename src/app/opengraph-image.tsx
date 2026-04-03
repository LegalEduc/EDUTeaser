import { ImageResponse } from "next/og";
import { getBaseUrl } from "@/lib/base-url";

export const runtime = "edge";
export const alt = "리걸크루 변호사 실전 압축 부트캠프 마스터 등록";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const baseUrl = getBaseUrl();
  const logoUrl = `${baseUrl}/legalcrew-logo.png`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#181d26",
          padding: "64px 72px",
        }}
      >
        <img
          src={logoUrl}
          width={360}
          height={112}
          alt="리걸크루 로고"
          style={{ objectFit: "contain" }}
        />
        <div
          style={{
            width: 420,
            height: 1,
            backgroundColor: "rgba(72,116,247,0.35)",
            marginTop: 34,
            marginBottom: 34,
          }}
        />
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#151517",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: -1,
          }}
        >
          변호사 실전 압축 부트캠프
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#4874F7",
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: -1,
            marginTop: 6,
          }}
        >
          마스터 등록
        </div>
      </div>
    ),
    { ...size }
  );
}
