/* eslint-disable @next/next/no-img-element */
import { getSiteEvidence, publicationLogo, RESEARCH_PARTNER } from "@/lib/registry/preuves";
export function ClientReference({ id, children }: { id: string; children: React.ReactNode }) {
  const evidence = getSiteEvidence(id, "home");
  if (!evidence) return null;
  return <div data-evidence={id}><b>{evidence.display_name}</b><p className="muted">{children}</p></div>;
}
export function ResearchPartner() {
  const logo = publicationLogo(RESEARCH_PARTNER.logo);
  if (!logo || !RESEARCH_PARTNER.title?.trim()) return null;
  return <div className="research-partner"><img src={logo} alt={RESEARCH_PARTNER.title}/></div>;
}

const logoDimensions = [
  // Hauteurs optiques : Forexpert est compact ; le dessin SNCF occupe la moitié du SVG carré.
  ["Laparra", 551, 120, 56], ["Clevery", 367, 120, 56], ["Forexpert", 119, 120, 88],
  ["Joone", 387, 120, 56], ["SNCF", 24, 24, 88],
] as const;
export function ClientLogoStrip() {
  const logos = logoDimensions.flatMap(([id, width, height, displayHeight]) => {
    const evidence = getSiteEvidence(id, "home");
    const file = evidence && publicationLogo(evidence.logo);
    return file && evidence ? [{ id, name: evidence.display_name, file, width: width / height * displayHeight, height: displayHeight }] : [];
  });
  if (!logos.length) return null;
  return <div className="logo-strip" tabIndex={0} role="region" aria-label="Clients"><div className="logo-track">{[false, true].map(duplicate =>
    <div key={String(duplicate)} className="logo-set" aria-hidden={duplicate ? "true" : undefined}>
      {logos.map(logo => <span key={logo.id} data-evidence={logo.id} role="img" aria-label={logo.name} className="client-logo" style={{ maskImage: `url(${logo.file})`, width: logo.width, minHeight: logo.height }}/>) }
    </div>)}</div></div>;
}
