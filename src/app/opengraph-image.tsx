import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Parrit · On déploie l'IA dans votre entreprise et on l'opère avec vous";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FEFDF9",
          display: "flex",
          flexDirection: "column",
          padding: "70px 90px",
          fontFamily: "Georgia, serif",
          color: "#0C0C0D",
          position: "relative",
        }}
      >
        {/* Chinese red seal accent top-right */}
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 60,
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "#D1132F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid #0C0C0D",
            transform: "rotate(-8deg)",
            boxShadow: "5px 5px 0 #0C0C0D",
          }}
        />

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#D1132F",
            marginBottom: 30,
          }}
        >
          PARRIT·AI · OPERATING PARTNER
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: 180,
            fontWeight: 500,
            lineHeight: 0.95,
            letterSpacing: -2,
            color: "#0C0C0D",
            marginBottom: 22,
          }}
        >
          PARRIT
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 46,
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 1.15,
            color: "#0C0C0D",
            marginBottom: 22,
            maxWidth: 980,
          }}
        >
          On déploie l'IA dans votre entreprise. Et on l'opère avec vous.
        </div>

        {/* Sub */}
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: 24,
            lineHeight: 1.4,
            color: "#4A4A4E",
            maxWidth: 900,
          }}
        >
          Sur le front qui fait tourner votre boîte comme sur celui qui la fait grandir. Des outils en production, qu'on porte avec vous.
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
            color: "#4A4A4E",
            borderTop: "2px solid #0C0C0D",
            paddingTop: 18,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#D1132F" }} />
            parrit.ai
          </div>
          <div style={{ color: "#0C0C0D", fontWeight: 600 }}>Paul Larmaraud · Yukun Leng</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
