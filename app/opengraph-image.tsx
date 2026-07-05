import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Appu Kaju — Premium Dry Fruits, Fresh from Lucknow Since 1998";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "linear-gradient(150deg, #2b1d14 0%, #1c120b 60%, #241710 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#c6a15b",
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
          }}
        >
          Est. 1998 · Lucknow · India
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 132,
            fontWeight: 700,
            color: "#f5efe4",
            letterSpacing: -3,
          }}
        >
          APPU KAJU
        </div>
        <div
          style={{
            marginTop: 8,
            width: 520,
            height: 2,
            background: "linear-gradient(90deg, transparent, #d4af37, transparent)",
          }}
        />
        <div style={{ marginTop: 26, fontSize: 34, color: "#d4af37" }}>
          The Art of the Perfect Handful
        </div>
      </div>
    ),
    { ...size }
  );
}
