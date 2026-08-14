import type { Metadata } from "next";

import "../../system/fonts.css";
import "../../system/tokens.css";
import "../../system/system.css";

export const metadata: Metadata = {
  title: "Parrit Command System · REV 01",
  description: "Internal verification surface for the Parrit command system.",
  robots: { index: false, follow: false, nocache: true },
};

export default function SystemLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
