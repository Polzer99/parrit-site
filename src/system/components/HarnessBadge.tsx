import "server-only";
import { checkCertificate } from "../harness-certificates.mjs";

export function HarnessBadge({ slug, locale = "en" }: { slug: string; locale?: "fr" | "en" }) {
  if (!checkCertificate(slug).valid) return null;

  return (
    <aside className="harness-badge" aria-label="Harness">
      <strong>{locale === "fr" ? "Vérifié par le contrôle interne" : "Harness Certified ✓"}</strong>
      <p>
        {locale === "fr"
          ? "Contrôle interne Parrit.ai, sans accréditation externe. "
          : "Parrit.ai internal check, with no external accreditation. "}
        <a href={`/certificates/${slug}.json`}>
          {locale === "fr" ? "Voir la preuve" : "See the proof"}
        </a>
      </p>
    </aside>
  );
}
