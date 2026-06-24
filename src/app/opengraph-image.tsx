import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Parrit.ai · Diagnostic IA avant transformation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F8FF",
          display: "flex",
          flexDirection: "column",
          padding: "70px 90px 56px",
          fontFamily: "sans-serif",
          color: "#161616",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 38,
            right: 48,
            width: 260,
            height: 260,
            borderRadius: "50%",
            border: "18px solid #AA0003",
            opacity: 0.08,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#AA0003",
            fontSize: 170,
            fontWeight: 800,
            transform: "rotate(-6deg)",
          }}
        >
          速
        </div>

        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#AA0003",
            marginBottom: 34,
          }}
        >
          PARRIT·AI · FRACTIONAL AI OPERATOR
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 42,
          }}
        >
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              color: "#161616",
            }}
          >
            PARRIT
          </div>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "3px solid #AA0003",
              color: "#AA0003",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            速
          </div>
          <div
            style={{
              fontSize: 78,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              color: "#161616",
            }}
          >
            AI
          </div>
        </div>

        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1.2,
            color: "#161616",
            maxWidth: 930,
          }}
        >
          Au-delà de l&apos;IA qui discute.
          <br />
          <span style={{ color: "#AA0003" }}>Diagnostic IA avant transformation.</span>
        </div>

        <div
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgba(20,20,26,.10)",
            paddingTop: 22,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6E7079",
            fontSize: 23,
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#AA0003" }} />
            parrit.ai
          </div>
          <div style={{ color: "#161616", fontWeight: 700 }}>Paul Larmaraud · Yukun Leng</div>
        </div>
      </div>
    ),
    size,
  );
}
