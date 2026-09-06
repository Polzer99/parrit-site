import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Parrit.ai · Company Operating Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

function token(name: string): string {
  const tokens = readFileSync(path.join(process.cwd(), "src/system/tokens.css"), "utf8");
  const match = tokens.match(new RegExp(`${name}\\s*:\\s*([^;]+)`));
  if (!match) throw new Error(`Missing design token ${name}.`);
  return match[1].trim();
}

export default async function Image() {
  const [plexSans, plexMono] = await Promise.all([
    readFile(path.join(process.cwd(), "src/og-assets/GeneralSans-Medium.otf")),
    readFile(path.join(process.cwd(), "src/og-assets/JetBrainsMono-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: token("--carbon"),
          color: token("--paper"),
          fontFamily: "General Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            letterSpacing: "0.18em",
            color: token("--g4"),
          }}
        >
          <span>PARRIT.AI · COMPANY OPERATING SYSTEMS</span>
          <span style={{ display: "flex" }}>
            [P<span style={{ color: token("--red") }}>.</span>]
          </span>
        </div>
        <div
          style={{
            fontSize: 104,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            maxWidth: 820,
          }}
        >
          Your company. One system.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: "JetBrains Mono",
            fontSize: 20,
            letterSpacing: "0.16em",
            color: token("--g2"),
          }}
        >
          <div style={{ width: 14, height: 14, background: token("--red") }} />
          <span>COMMISSIONED, NOT SUBSCRIBED · PARRIT / SITE · REV 01 · 2026</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "General Sans", data: plexSans, weight: 500, style: "normal" },
        { name: "JetBrains Mono", data: plexMono, weight: 600, style: "normal" },
      ],
    },
  );
}
