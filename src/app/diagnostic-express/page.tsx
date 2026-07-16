import DiagnosticExpressClient from "./DiagnosticExpressClient";

const SITE_URL = "https://parrit.ai";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Diagnostic Express Parrit",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Diagnostic sur-mesure d'un site web sur ses deux fronts (back-office et business), envoyé par mail avec un code d'accès.",
  inLanguage: "fr",
  url: `${SITE_URL}/diagnostic-express`,
  isAccessibleForFree: true,
  provider: { "@type": "Organization", name: "Parrit.ai", url: SITE_URL },
};

export default function DiagnosticExpressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <DiagnosticExpressClient />
    </>
  );
}
