/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
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
  ["Laparra", 551, 120, 67], ["Clevery", 367, 120, 67], ["Forexpert", 119, 120, 106],
  ["Joone", 387, 120, 67], ["SNCF", 24, 24, 106],
  ["Toyotomi Europe", 537, 120, 67], ["Hiolle Technologies", 402, 120, 67], ["Carte Noire", 254, 120, 67],
] as const;
export function ClientLogoStrip() {
  const logos = logoDimensions.flatMap(([id, width, height, displayHeight]) => {
    const evidence = getSiteEvidence(id, "home");
    const file = evidence && publicationLogo(evidence.logo);
    return file && evidence ? [{ id, name: evidence.display_name, file, width: width / height * displayHeight, height: displayHeight }] : [];
  });
  if (!logos.length) return null;
  return <div className="logo-strip" tabIndex={0} role="region" aria-label="Clients"><div className="logo-track"><div className="logo-set">
      {logos.map((logo, index) => <span key={logo.id} data-evidence={logo.id} role="img" aria-label={logo.name} className="client-logo" style={{ width: logo.width, minHeight: logo.height }}>
        <img src={logo.file} loading="lazy" alt="" aria-hidden="true" width={logo.width} height={logo.height} style={{ "--logo-cycle": `${logos.length * 1.6}s`, "--logo-delay": `${index * 1.6}s` } as CSSProperties}/>
      </span>) }
    </div></div></div>;
}
