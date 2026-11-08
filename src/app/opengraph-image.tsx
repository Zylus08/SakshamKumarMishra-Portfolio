import { ImageResponse } from "next/og";
export const alt = "Saksham Kumar Mishra — The pursuit of understanding";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#101114",
        color: "#f1eee8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "70px",
      }}
    >
      <div style={{ fontSize: 25, letterSpacing: 5 }}>
        SKM. / A DIGITAL RESEARCH ATELIER
      </div>
      <div
        style={{
          fontSize: 88,
          fontFamily: "serif",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>The pursuit of</span>
        <span style={{ color: "#cf9874" }}>understanding.</span>
      </div>
      <div style={{ fontSize: 23 }}>
        SAKSHAM KUMAR MISHRA · RESEARCH / ENGINEERING
      </div>
    </div>,
    size,
  );
}
