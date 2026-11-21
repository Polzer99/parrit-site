import type { Metadata } from "next";
import { NotFoundView } from "@/system/components/NotFoundView";
import "../system/fonts.css";
import "../system/brand-os.tokens.css";
import "../system/tokens.css";
import "../system/system.css";
import "./(rev01)/rev01.css";
import "../system/single-page.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parrit.ai"),
  title: "Page not found · Parrit.ai",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <>
    {/* La page n'a pas le gabarit commun : elle précharge elle-même la police de la marque. */}
    <link rel="preload" href="/fonts/rev02/GeneralSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/rev02/GeneralSans-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/rev02/GeneralSans-Semibold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <NotFoundView />
  </>;
}
