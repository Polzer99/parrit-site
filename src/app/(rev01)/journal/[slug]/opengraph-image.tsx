import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getJournalEntry } from "@/system/journal";

export const alt = "Parrit Journal article";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type JournalOpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

function token(name: string): string {
  const tokens = fs.readFileSync(path.join(process.cwd(), "src/system/tokens.css"), "utf8");
  const match = tokens.match(new RegExp(`${name}\\s*:\\s*([^;]+)`));

  if (!match) {
    throw new Error(`Missing design token ${name}.`);
  }

  return match[1].trim();
}

export default async function JournalOpenGraphImage({ params }: JournalOpenGraphImageProps) {
  const { slug } = await params;
  const entry = getJournalEntry(slug);

  if (!entry) {
    notFound();
  }

  const geist = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/geist/Geist-Medium.woff2"),
  );
  const geistMono = fs.readFileSync(
    path.join(process.cwd(), "public/fonts/geist/GeistMono-Medium.woff2"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: token("--ink"),
          color: token("--paper"),
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Mono",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: token("--g4"),
          }}
        >
          PARRIT / JOURNAL · REV 01 · {entry.date}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 1000,
            fontSize: 68,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineHeight: 1.05,
          }}
        >
          {entry.title}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist, weight: 500 },
        { name: "Geist Mono", data: geistMono, weight: 500 },
      ],
    },
  );
}
