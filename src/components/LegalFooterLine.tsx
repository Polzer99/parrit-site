import Link from "next/link";

// Ligne légale partagée : © + liens Mentions légales / Confidentialité.
// Rend le légal atteignable depuis chaque pied de page du site.
export default function LegalFooterLine({
  lang,
  marginTop = 40,
}: {
  lang: string;
  marginTop?: number;
}) {
  const fr = lang === "fr";
  return (
    <p className="footer-legal" style={{ marginTop }}>
      © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison ·{" "}
      <Link href={`/${lang}/mentions-legales`}>{fr ? "Mentions légales" : "Legal notice"}</Link> ·{" "}
      <Link href={`/${lang}/confidentialite`}>{fr ? "Confidentialité" : "Privacy"}</Link>
    </p>
  );
}
