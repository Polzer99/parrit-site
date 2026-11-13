import "server-only";
import { checkCertificate } from "../harness-certificates.mjs";

export function HarnessBadge({ slug, locale = "en" }: { slug: string; locale?: "fr" | "en" }) {
  if (!checkCertificate(slug).valid) return null;

  return (
    <aside className="harness-badge" aria-label="Harness">
      <strong>{locale === "fr" ? "Vérifié par le contrôle interne" : "Harness Certified"}</strong>
      {locale === "en" && <>{" "}<svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "-0.125em" }}><path d="m3 8 3 3 7-7" /></svg></>}
      <p>
        {locale === "fr"
          ? "Contrôle interne Parrit.ai de l'original anglais, sans accréditation externe. "
          : "Parrit.ai internal check, with no external accreditation. "}
        <a href={`/certificates/${slug}.json`}>
          {locale === "fr" ? "Voir la preuve" : "See the proof"}
        </a>
      </p>
    </aside>
  );
}
