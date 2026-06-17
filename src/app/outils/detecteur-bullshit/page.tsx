import Link from "next/link";
import DetecteurClient from "./DetecteurClient";

const SITE_URL = "https://parrit.ai";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Détecteur de Bullshit IA",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Outil qui passe au crible un contenu sur l'IA : score de bullshit 0-100, décomposition en 4 axes et verdict, selon la doctrine éditoriale de Paul Larmaraud.",
  inLanguage: "fr",
  url: `${SITE_URL}/outils/detecteur-bullshit`,
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "Parrit.ai", url: SITE_URL },
};

export default function DetecteurBullshitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="blog-nav">
        <Link href="/fr" className="nav-logo">
          Parrit.ai
        </Link>
        <Link href="/academy" className="blog-nav-link">
          Claude Code Academy
        </Link>
      </nav>

      <DetecteurClient />
    </>
  );
}
