import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0c0c0d",
          color: "#c6ff3d",
          fontSize: 38,
          fontWeight: 700,
          fontFamily: "sans-serif",
          borderRadius: 14,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
