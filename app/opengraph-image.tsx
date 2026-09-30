import { ImageResponse } from "next/og";

export const alt = "Killswitch — Code Under Pressure";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07090d",
          color: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#39FF14",
              color: "#050706",
              fontSize: "36px",
              fontWeight: 900,
              transform: "skew(-8deg)",
            }}
          >
            K
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "4px" }}>
            KILLSWITCH
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              color: "#39FF14",
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Season Zero
          </div>
          <div
            style={{
              maxWidth: "980px",
              fontSize: "82px",
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: "-4px",
            }}
          >
            CODE UNDER PRESSURE.
          </div>
          <div style={{ fontSize: "28px", color: "#aab2c0", maxWidth: "900px" }}>
            Four developers. One problem. Audience-controlled chaos.
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", fontSize: "20px", color: "#7d8797" }}>
          <span>LIVE CODING</span>
          <span>•</span>
          <span>AUDIENCE MODIFIERS</span>
          <span>•</span>
          <span>OBS-READY</span>
        </div>
      </div>
    ),
    size,
  );
}
