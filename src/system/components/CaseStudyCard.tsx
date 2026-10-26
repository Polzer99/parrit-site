import { getSiteEvidence } from "@/lib/registry/preuves";
import type { Locale } from "@/system/locale";

export const CASE_STUDY_COPY = {
  fr: {
    "demo-crm": ["Une carte de visite devient une fiche CRM après validation.", "Une carte de visite à saisir.", "Préparer la fiche et demander une validation.", "Une fiche CRM après validation.", "Démonstration, données fictives."],
    Laparra: ["Un CRM pour un grossiste du MIN de Rungis (Laparra).", "Le suivi commercial d'un grossiste.", "Construire un CRM adapté à ce métier.", "Un CRM.", "Réalisé pour le client."],
    Clevery: ["Un agent pour un cabinet d'avocats (Clevery Avocats).", "Les opérations d'un cabinet d'avocats.", "Construire un agent pour le cabinet.", "Un agent.", "Réalisé pour le client."],
  },
  en: {
    "demo-crm": ["A business card becomes a CRM record after approval.", "A business card to enter.", "Prepare the record and request approval.", "A CRM record after approval.", "Demonstration, fictional data."],
    Laparra: ["A CRM for a wholesaler at the Rungis market (Laparra).", "A wholesaler's sales follow-up.", "Build a CRM adapted to this business.", "A CRM.", "Built for the client."],
    Clevery: ["An agent for a law firm (Clevery Avocats).", "A law firm's operations.", "Build an agent for the firm.", "An agent.", "Built for the client."],
  },
} as const;
export function CaseStudyCard({ id, locale, pageId }: { id: keyof typeof CASE_STUDY_COPY.fr; locale: Locale; pageId: string }) {
  if (!getSiteEvidence(id, pageId)) return null;
  const [title, problem, intervention, system, status] = CASE_STUDY_COPY[locale][id];
  const labels = locale === "fr" ? ["Problème", "Intervention", "Système", "Statut"] : ["Problem", "Intervention", "System", "Status"];
  return <article className="v1-case" data-evidence={id}><dl className="v1-case-status"><div><dt>{labels[3]}</dt><dd>{status}</dd></div></dl><h3>{title}</h3><dl>{[problem, intervention, system].map((text, index) => <div key={labels[index]}><dt>{labels[index]}</dt><dd>{text}</dd></div>)}</dl></article>;
}
