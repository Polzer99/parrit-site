import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Parrit · Une équipe d'agents IA qui bosse pour vous";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f3e8d3",
          display: "flex",
          flexDirection: "column",
          padding: "70px 90px",
          fontFamily: "Georgia, serif",
          color: "#2A2420",
          position: "relative",
        }}
      >
        {/* Chinese red stamp accent top-right */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 60,
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "#C44536",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #2A2420",
            transform: "rotate(-8deg)",
            color: "#FFFCF5",
            fontSize: 40,
            fontWeight: 700,
          }}
        >
          P
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#C44536",
            marginBottom: 30,
          }}
        >
          PARRIT.AI · TRANSFORMATION IA
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: -2,
            color: "#2A2420",
            marginBottom: 20,
          }}
        >
          PARRIT
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 48,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#2A2420",
            marginBottom: 22,
            maxWidth: 950,
          }}
        >
          Une équipe d'agents IA qui bosse pour vous.
        </div>

        {/* Sub */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 24,
            lineHeight: 1.4,
            color: "#5A5047",
            maxWidth: 880,
          }}
        >
          Quatre agents sur mesure, branchés sur votre stack. Back-office, business, prototype, formation. Même quand vous dormez.
        </div>

        {/* Bottom strip */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: 90,
            right: 90,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "DM Sans, sans-serif",
            fontSize: 20,
            color: "#5A5047",
            borderTop: "2px solid #2A2420",
            paddingTop: 18,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#5FAF8E" }} />
            parrit.ai
          </div>
          <div style={{ color: "#2A2420", fontWeight: 600 }}>Paul Larmaraud · Yukun Leng</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
