import type { Metadata } from "next";
import Link from "next/link";
import { K, RevFooter, RevHeader } from "@/system/components";
import "../system/fonts.css";
import "../system/brand-os.tokens.css";
import "../system/tokens.css";
import "../system/system.css";
import "./(rev01)/rev01.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parrit.ai"),
  title: "Page not found · Parrit.ai",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <div lang="en">
    <RevHeader locale="en" />
    <main className="rev-page r2-dark">
      <div className="r2-wrap">
        <header className="r2-hero">
          <K>Parrit / 404</K>
          <h1>This page does not exist.<br /><span lang="fr">Cette page n&apos;existe pas.</span></h1>
        </header>
        <nav className="r2-close" aria-label="Page not found">
          <Link className="rev-button exec" href="/">Back to the home page</Link>
          <Link className="rev-button ghost" href="/fr" lang="fr">Revenir à l&apos;accueil</Link>
          <Link href="/journal">Read the Journal</Link>
        </nav>
      </div>
    </main>
    <RevFooter locale="en" />
  </div>;
}
