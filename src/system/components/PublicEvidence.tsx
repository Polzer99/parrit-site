/* eslint-disable @next/next/no-img-element */
import { getSiteEvidence, publicationLogo, RESEARCH_PARTNER } from "@/lib/registry/preuves";
export function ClientReference({ id, children }: { id: string; children: React.ReactNode }) {
  const evidence = getSiteEvidence(id, "home");
  if (!evidence) return null;
  const logo = publicationLogo(evidence.logo);
  return <div data-evidence={id}><h3>{logo ? <img className="client-logo" src={logo} alt={evidence.display_name}/> : evidence.display_name}</h3><p className="muted">{children}</p></div>;
}
export function ResearchPartner() {
  const logo = publicationLogo(RESEARCH_PARTNER.logo);
  if (!logo || !RESEARCH_PARTNER.title?.trim()) return null;
  return <div className="research-partner"><img src={logo} alt={RESEARCH_PARTNER.title}/></div>;
}
