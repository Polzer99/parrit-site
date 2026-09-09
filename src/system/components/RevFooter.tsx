import Link from "next/link";

import { localizedPath, type Locale } from "@/system/locale";

const FOOTER = {
  en: {
    links: [
      ["/manufacture", "The Manufacture", "the method"],
      ["/standard", "The Standard", "our commitments"],
      ["/dossiers", "The Dossiers", "references"],
      ["/journal", "The Journal", "field notes"],
      ["/commission", "Commission", "book an examination"],
      ["/legal", "Legal", ""],
    ],
    founder: "Founded by Paul Larmaraud",
    principle: "Commissioned, not subscribed",
  },
  fr: {
    links: [
      ["/manufacture", "La Manufacture", "la méthode"],
      ["/standard", "Le Standard", "nos engagements"],
      ["/dossiers", "Les Dossiers", "références"],
      ["/journal", "Le Journal", "les chantiers"],
      ["/commission", "Commande", "réserver un examen"],
      ["/legal", "Mentions légales", ""],
    ],
    founder: "Fondée par Paul Larmaraud",
    principle: "Une commande, pas un abonnement",
  },
} as const;

export function RevFooter({ locale }: { locale: Locale }) {
  const copy = FOOTER[locale];

  return (
    <footer className="home-s-footer r2-dark">
      <div className="home-s-wrap">
        <nav aria-label="Footer">
          {copy.links.map(([href, label, description]) => <Link href={localizedPath(href, locale)} key={href}><span>{label}</span>{description ? <small> · {description}</small> : null}</Link>)}
        </nav>
        <div className="home-s-footer-meta">
          <a href="https://paul-larmaraud.com">{copy.founder}</a>
          <span>{copy.principle}</span>
          <span>© 2026 Parrit.ai</span>
        </div>
      </div>
    </footer>
  );
}
