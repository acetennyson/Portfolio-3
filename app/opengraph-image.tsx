import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ado Daniel Nji — Full-Stack Developer & Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0d",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#c6ff3d" }} />
          <span style={{ color: "#8d8a84", fontSize: 28, letterSpacing: 2, textTransform: "uppercase" }}>
            Ado Daniel Nji
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ color: "#ede8df", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            I build things
          </span>
          <span style={{ color: "#c6ff3d", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            people love.
          </span>
        </div>
        <div style={{ display: "flex", color: "#8d8a84", fontSize: 30 }}>
          Full-Stack Developer &amp; Designer — Douala, Cameroon
        </div>
      </div>
    ),
    { ...size }
  );
}
