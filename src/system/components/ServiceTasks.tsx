import type { CSSProperties } from "react";
import type { Locale } from "@/system/locale";
import { SINGLE_PAGE_EN } from "@/system/single-page-copy";
const services = [
  ["Direction", "Elle résume les décisions de chaque réunion.", "Comité du lundi", "3 décisions"],
  ["Finance", "Elle signale les écarts entre deux fichiers.", "Relevé et grand livre", "2 écarts"],
  ["Commercial", "Elle repère les entreprises à contacter.", "Secteur et région", "12 entreprises"],
  ["Administration des ventes", "Elle saisit les commandes reçues par e-mail.", "Commandes du jour", "8 saisies"],
  ["Achats", "Elle compare les offres des fournisseurs.", "Trois devis", "1 recommandation"],
  ["Logistique", "Elle prévient quand une livraison prend du retard.", "Expéditions du jour", "2 retards"],
  ["Production", "Elle prépare le planning de la semaine.", "Ordres de fabrication", "5 lignes"],
  ["Qualité", "Elle classe les réclamations par cause.", "Réclamations du mois", "4 causes"],
  ["Service client", "Elle propose une réponse à chaque demande.", "Demandes du jour", "9 réponses"],
  ["Ressources humaines", "Elle vérifie qu'un dossier est complet.", "Nouvel arrivant", "1 pièce à fournir"],
  ["Marketing", "Elle adapte un même texte à chaque canal.", "Annonce produit", "4 versions"],
  ["Juridique", "Elle prépare un projet de contrat à relire.", "Contrat", "12 clauses"],
] as const;
export function ServiceTasks({ locale }: { locale: Locale }) {
  const t = (text: string) => locale === "fr" ? text : SINGLE_PAGE_EN[text];
  return <div className="service-tasks">{services.map(([title, description, task, count], i) =>
    <div key={title} style={{ "--task-delay": `${i * .45}s` } as CSSProperties}>
      <span className="s">{t(title)}</span><p>{t(description)}</p>
      <div className="job"><div className="line"><span>{t(task)}</span><span>{t(count)}</span></div>
        <div className="bar" aria-hidden="true"><i/></div><div className="done">{t("Prêt à relire")}</div>
      </div>
    </div>)}</div>;
}
