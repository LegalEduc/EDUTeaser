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
          backgroundColor: "#0f0f1e",
          color: "#faf8f5",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700 }}>LegalCrew</div>
        <div
          style={{
            fontSize: 52,
            fontStyle: "italic",
            color: "#c4993c",
            marginTop: 8,
          }}
        >
          Academy
        </div>
        <div
          style={{
            width: 400,
            height: 1,
            backgroundColor: "#c4993c",
            opacity: 0.4,
            marginTop: 32,
            marginBottom: 32,
          }}
        />
        <div style={{ fontSize: 28, color: "rgba(250,248,245,0.5)" }}>
          The Rookie Camp
        </div>
      </div>
    ),
    { ...size }
  );
}
