import Link from "next/link";

import { localizedPath, type Locale } from "@/system/locale";

const FOOTER = {
  en: {
    links: [
      ["/systems", "Systems", ""],
      ["/manufacture", "How we build", "the method"],
      ["/standard", "The Standard", "our commitments"],
      ["/dossiers", "Case files", "references"],
      ["/journal", "The Journal", "field notes"],
      ["/commission", "Talk about a project", ""],
      ["/build-with-you", "Build a first system with us", ""],
      ["/legal", "Legal", ""],
    ],
  },
  fr: {
    links: [
      ["/systems", "Systèmes", ""],
      ["/manufacture", "La Manufacture", "la méthode"],
      ["/standard", "Le Standard", "nos engagements"],
      ["/dossiers", "Les Dossiers", "références"],
      ["/journal", "Le Journal", "notes de chantier"],
      ["/commission", "Parler d'un projet", ""],
      ["/build-with-you", "Construire un premier système avec nous", ""],
      ["/legal", "Mentions légales", ""],
    ],
  },
} as const;

export function RevFooter({ locale }: { locale: Locale }) {
  const copy = FOOTER[locale];

  return (
    <footer className="home-s-footer r2-dark">
      <div className="home-s-wrap">
        <nav aria-label="Footer">
          {copy.links.map(([href, label, description]) => <Link href={localizedPath(href, locale)} key={href}><span>{label}</span>{description ? <small>{"\u00a0· "}{description}</small> : null}</Link>)}
        </nav>
        <div className="home-s-footer-meta">
          <span>© 2026 Parrit.ai</span>
        </div>
      </div>
    </footer>
  );
}
