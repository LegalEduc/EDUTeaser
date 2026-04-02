import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LegalCrew Academy — The Rookie Camp";
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
          backgroundColor: "#181d26",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>LegalCrew</div>
        <div
          style={{
            fontSize: 52,
            fontStyle: "italic",
            color: "#2d7ff9",
            marginTop: 8,
          }}
        >
          Academy
        </div>
        <div
          style={{
            width: 400,
            height: 1,
            backgroundColor: "rgba(45,127,249,0.45)",
            marginTop: 32,
            marginBottom: 32,
          }}
        />
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.55)" }}>
          The Rookie Camp
        </div>
      </div>
    ),
    { ...size }
  );
}
