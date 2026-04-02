import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "리걸크루 변호사 실전 압축 부트캠프 — 마스터 초빙";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          padding: 48,
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700, textAlign: "center", lineHeight: 1.25 }}>
          리걸크루
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#1b61c9", marginTop: 16, textAlign: "center" }}>
          변호사 실전 압축 부트캠프
        </div>
        <div
          style={{
            width: 360,
            height: 1,
            backgroundColor: "rgba(27,97,201,0.35)",
            marginTop: 28,
            marginBottom: 28,
          }}
        />
        <div style={{ fontSize: 24, color: "rgba(24,29,38,0.65)", textAlign: "center" }}>
          마스터 초빙
        </div>
      </div>
    ),
    { ...size }
  );
}
