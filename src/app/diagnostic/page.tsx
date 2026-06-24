import Link from "next/link";
import DiagnosticClient from "./DiagnosticClient";

const SITE_URL = "https://parrit.ai";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Parler à Parrit : diagnostic sur-mesure",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Diagnostic conversationnel : un agent Parrit analyse votre cas sur deux fronts (back-office et business), adapté à votre métier.",
  inLanguage: "fr",
  url: `${SITE_URL}/diagnostic`,
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "Parrit.ai", url: SITE_URL },
};

export default function DiagnosticPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="blog-nav">
        <Link href="/fr" className="nav-logo">Parrit.ai</Link>
        <Link href="/fr/blog" className="blog-nav-link">Nos articles →</Link>
      </nav>
      <h1 className="sr-only">Parler à Parrit, votre diagnostic IA sur-mesure</h1>
      <DiagnosticClient />
    </>
  );
}
