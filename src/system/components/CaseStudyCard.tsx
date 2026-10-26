import { getSiteEvidence } from "@/lib/registry/preuves";
import type { Locale } from "@/system/locale";

export const CASE_STUDY_COPY = {
  fr: {
    "demo-crm": ["Une carte de visite devient une fiche CRM, après validation.", "Démonstration, données fictives."],
    Laparra: ["Laparra, grossiste du MIN de Rungis : un CRM construit pour son suivi commercial.", "Construit pour le client."],
    Clevery: ["Clevery Avocats : un agent construit pour le cabinet.", "Construit pour le client."],
  },
  en: {
    "demo-crm": ["A business card becomes a CRM record, once approved.", "Demonstration, fictional data."],
    Laparra: ["Laparra, a wholesaler at the Rungis market: a CRM built for its sales follow-up.", "Built for the client."],
    Clevery: ["Clevery Avocats: an agent built for the firm.", "Built for the client."],
  },
} as const;
export function CaseStudyCard({ id, locale, pageId }: { id: keyof typeof CASE_STUDY_COPY.fr; locale: Locale; pageId: string }) {
  if (!getSiteEvidence(id, pageId)) return null;
  const [title, status] = CASE_STUDY_COPY[locale][id];
  return <article className="v1-case" data-evidence={id}><h3>{title}</h3><p className="v1-case-status">{status}</p></article>;
}
