import type { Metadata } from "next";

import "../../system/fonts.css";
import "../../system/tokens.css";
import "../../system/system.css";
import "./rev01.css";

import { RevHeader } from "@/system/components";

export const metadata: Metadata = {
  metadataBase: new URL("https://parrit.ai"),
  title: {
    default: "Parrit — Company Operating Systems",
    template: "%s · Parrit",
  },
  description:
    "Parrit examines how a company operates, builds its first production system and compounds it as owned infrastructure.",
};

export default function Rev01Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RevHeader />
        {children}
      </body>
    </html>
  );
}
