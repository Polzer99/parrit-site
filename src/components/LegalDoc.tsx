import Link from "next/link";
import type { Locale } from "@/app/[lang]/dictionaries";

export type LegalKind = "mentions-legales" | "confidentialite";

type Section = { h2: string; body: React.ReactNode[] };
type DocCopy = {
  metaTitle: string;
  metaDesc: string;
  label: string;
  title: string;
  updated: string;
  sections: Section[];
};

const NAV: Record<Locale, { blog: string; res: string }> = {
  fr: { blog: "Blog", res: "Ressources" },
  en: { blog: "Blog", res: "Resources" },
  "pt-BR": { blog: "Blog", res: "Recursos" },
  "zh-CN": { blog: "博客", res: "资源" },
};

// Identification légale (données publiques RNE / annuaire-entreprises.data.gouv.fr).
const EDITEUR = {
  denomination: "PARRIT.AI",
  forme: "Société par actions simplifiée à associé unique (SASU)",
  formeEn: "Simplified joint-stock company with a sole shareholder (SASU)",
  capital: "100 €",
  siege: "3 avenue Otis Mygatt, 92500 Rueil-Malmaison, France",
  rcs: "Nanterre 928 503 218",
  siret: "928 503 218 00010",
  tva: "FR48 928 503 218",
  ape: "62.01Z (Programmation informatique)",
  apeEn: "62.01Z (Computer programming)",
  directeur: "Paul Larmaraud",
  email: "paul.larmaraud@parrit.ai",
};
const HEBERGEUR = "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis (vercel.com)";
const HEBERGEUR_EN = "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA (vercel.com)";

function mentionsFr(): DocCopy {
  return {
    metaTitle: "Mentions légales · Parrit.ai",
    metaDesc: "Mentions légales du site Parrit.ai : éditeur, hébergeur, propriété intellectuelle.",
    label: "Informations légales",
    title: "Mentions légales",
    updated: "Dernière mise à jour : juillet 2026.",
    sections: [
      {
        h2: "Éditeur du site",
        body: [
          <>
            Le site parrit.ai est édité par <strong>{EDITEUR.denomination}</strong>, {EDITEUR.forme} au
            capital de {EDITEUR.capital}.
          </>,
          <>
            Siège social : {EDITEUR.siege}. Immatriculée au RCS de {EDITEUR.rcs}. SIRET :{" "}
            {EDITEUR.siret}. TVA intracommunautaire : {EDITEUR.tva}. Code APE : {EDITEUR.ape}.
          </>,
          <>
            Directeur de la publication : {EDITEUR.directeur}. Contact :{" "}
            <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>,
        ],
      },
      {
        h2: "Hébergement",
        body: [<>Le site est hébergé par {HEBERGEUR}.</>],
      },
      {
        h2: "Propriété intellectuelle",
        body: [
          <>
            L&apos;ensemble des contenus du site (textes, visuels, logos, marque Parrit.ai) est la
            propriété exclusive de {EDITEUR.denomination}, sauf mention contraire. Toute reproduction ou
            représentation, totale ou partielle, sans autorisation écrite préalable, est interdite.
          </>,
        ],
      },
      {
        h2: "Responsabilité",
        body: [
          <>
            {EDITEUR.denomination} s&apos;efforce d&apos;assurer l&apos;exactitude des informations
            publiées, sans garantie qu&apos;elles soient complètes ou à jour. Le site peut contenir des
            liens vers des sites tiers, sur le contenu desquels {EDITEUR.denomination} n&apos;exerce
            aucun contrôle et décline toute responsabilité.
          </>,
        ],
      },
      {
        h2: "Données personnelles",
        body: [
          <>
            Le traitement des données personnelles collectées via ce site est décrit dans notre{" "}
            <Link href="/fr/confidentialite">politique de confidentialité</Link>.
          </>,
        ],
      },
    ],
  };
}

function mentionsEn(): DocCopy {
  return {
    metaTitle: "Legal notice · Parrit.ai",
    metaDesc: "Legal notice for the Parrit.ai website: publisher, host, intellectual property.",
    label: "Legal information",
    title: "Legal notice",
    updated: "Last updated: July 2026.",
    sections: [
      {
        h2: "Publisher",
        body: [
          <>
            The parrit.ai website is published by <strong>{EDITEUR.denomination}</strong>,{" "}
            {EDITEUR.formeEn}, with a share capital of {EDITEUR.capital}.
          </>,
          <>
            Registered office: {EDITEUR.siege}. Registered with the Nanterre Trade and Companies
            Register under number 928 503 218. SIRET: {EDITEUR.siret}. VAT: {EDITEUR.tva}. Business code
            (APE): {EDITEUR.apeEn}.
          </>,
          <>
            Publication director: {EDITEUR.directeur}. Contact:{" "}
            <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>,
        ],
      },
      {
        h2: "Hosting",
        body: [<>The website is hosted by {HEBERGEUR_EN}.</>],
      },
      {
        h2: "Intellectual property",
        body: [
          <>
            All content on the site (text, visuals, logos, the Parrit.ai brand) is the exclusive property
            of {EDITEUR.denomination}, unless otherwise stated. Any reproduction or representation, in
            whole or in part, without prior written authorization, is prohibited.
          </>,
        ],
      },
      {
        h2: "Liability",
        body: [
          <>
            {EDITEUR.denomination} strives to keep the information published accurate, without
            guaranteeing that it is complete or up to date. The site may contain links to third-party
            sites over whose content {EDITEUR.denomination} has no control and for which it accepts no
            liability.
          </>,
        ],
      },
      {
        h2: "Personal data",
        body: [
          <>
            How personal data collected through this site is processed is described in our{" "}
            <Link href="/en/confidentialite">privacy policy</Link>.
          </>,
        ],
      },
    ],
  };
}

function confidentialiteFr(): DocCopy {
  return {
    metaTitle: "Politique de confidentialité · Parrit.ai",
    metaDesc:
      "Politique de confidentialité de Parrit.ai : données collectées, finalités, durée, vos droits (RGPD).",
    label: "Protection des données",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : juillet 2026.",
    sections: [
      {
        h2: "Responsable du traitement",
        body: [
          <>
            Le responsable du traitement des données est <strong>{EDITEUR.denomination}</strong>,{" "}
            {EDITEUR.siege}. Pour toute question : <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>,
        ],
      },
      {
        h2: "Données collectées",
        body: [
          <>
            Lorsque vous remplissez un formulaire (contact, prise de rendez-vous, accès à une ressource),
            nous collectons les données que vous fournissez : prénom, nom, adresse e-mail et, le cas
            échéant, numéro de téléphone. Nous mesurons aussi l&apos;audience du site via des statistiques
            de navigation.
          </>,
        ],
      },
      {
        h2: "Finalités",
        body: [
          <>
            Ces données servent à répondre à vos demandes, vous recontacter dans un cadre commercial,
            vous transmettre les ressources demandées et améliorer le site. Nous n&apos;envoyons rien sans
            raison légitime et ne revendons jamais vos données.
          </>,
        ],
      },
      {
        h2: "Base légale",
        body: [
          <>
            Le traitement repose sur votre consentement (formulaires) et sur l&apos;intérêt légitime de
            Parrit.ai à développer son activité et à sécuriser son site.
          </>,
        ],
      },
      {
        h2: "Destinataires et sous-traitants",
        body: [
          <>
            Vos données sont traitées par Parrit.ai et par ses prestataires techniques strictement
            nécessaires au service : hébergement (Vercel), automatisation des formulaires (n8n), base de
            données (Supabase) et mesure d&apos;audience (PostHog, hébergé dans l&apos;Union européenne).
            Certains prestataires peuvent traiter des données hors Union européenne, avec les garanties
            contractuelles prévues par le RGPD.
          </>,
        ],
      },
      {
        h2: "Durée de conservation",
        body: [
          <>
            Les données de prospection sont conservées trois ans à compter du dernier contact, conformément
            aux recommandations de la CNIL, puis supprimées ou anonymisées.
          </>,
        ],
      },
      {
        h2: "Vos droits",
        body: [
          <>
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation,
            d&apos;opposition et de portabilité de vos données. Pour les exercer, écrivez à{" "}
            <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>. Vous pouvez également introduire une
            réclamation auprès de la CNIL (cnil.fr).
          </>,
        ],
      },
    ],
  };
}

function confidentialiteEn(): DocCopy {
  return {
    metaTitle: "Privacy policy · Parrit.ai",
    metaDesc:
      "Parrit.ai privacy policy: data collected, purposes, retention, your rights (GDPR).",
    label: "Data protection",
    title: "Privacy policy",
    updated: "Last updated: July 2026.",
    sections: [
      {
        h2: "Data controller",
        body: [
          <>
            The data controller is <strong>{EDITEUR.denomination}</strong>, {EDITEUR.siege}. For any
            question: <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>.
          </>,
        ],
      },
      {
        h2: "Data we collect",
        body: [
          <>
            When you fill in a form (contact, booking, access to a resource), we collect the data you
            provide: first name, last name, email address and, where relevant, phone number. We also
            measure site audience through navigation analytics.
          </>,
        ],
      },
      {
        h2: "Purposes",
        body: [
          <>
            This data is used to answer your requests, contact you in a commercial context, send you the
            resources you asked for and improve the site. We never send anything without a legitimate
            reason and never resell your data.
          </>,
        ],
      },
      {
        h2: "Legal basis",
        body: [
          <>
            Processing is based on your consent (forms) and on Parrit.ai&apos;s legitimate interest in
            developing its business and securing its site.
          </>,
        ],
      },
      {
        h2: "Recipients and processors",
        body: [
          <>
            Your data is processed by Parrit.ai and by the technical providers strictly necessary to the
            service: hosting (Vercel), form automation (n8n), database (Supabase) and analytics (PostHog,
            hosted in the European Union). Some providers may process data outside the European Union,
            with the contractual safeguards required by the GDPR.
          </>,
        ],
      },
      {
        h2: "Retention",
        body: [
          <>
            Prospecting data is kept for three years from the last contact, in line with French data
            protection authority (CNIL) guidance, then deleted or anonymized.
          </>,
        ],
      },
      {
        h2: "Your rights",
        body: [
          <>
            You have the right to access, rectify, erase, restrict, object to and port your data. To
            exercise these rights, write to <a href={`mailto:${EDITEUR.email}`}>{EDITEUR.email}</a>. You
            may also lodge a complaint with the French data protection authority (CNIL, cnil.fr).
          </>,
        ],
      },
    ],
  };
}

function getCopy(kind: LegalKind, lang: Locale): DocCopy {
  const useEn = lang !== "fr";
  if (kind === "mentions-legales") return useEn ? mentionsEn() : mentionsFr();
  return useEn ? confidentialiteEn() : confidentialiteFr();
}

export function getLegalCopy(kind: LegalKind, lang: Locale): { metaTitle: string; metaDesc: string } {
  const c = getCopy(kind, lang);
  return { metaTitle: c.metaTitle, metaDesc: c.metaDesc };
}

export default function LegalDoc({ kind, lang }: { kind: LegalKind; lang: Locale }) {
  const copy = getCopy(kind, lang);
  const nav = NAV[lang] ?? NAV.fr;
  return (
    <>
      <nav className="blog-nav">
        <Link href={`/${lang}`} className="nav-logo">
          Parrit.ai
        </Link>
        <div className="blog-nav-links">
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {nav.blog}
          </Link>
          <Link href={`/${lang}/ressources`} className="blog-nav-link">
            {nav.res}
          </Link>
        </div>
      </nav>

      <article className="blog-article">
        <header className="blog-article-header">
          <p className="blog-header-label">{copy.label}</p>
          <h1 className="blog-article-title">{copy.title}</h1>
          <p className="blog-article-author">{copy.updated}</p>
        </header>
        <div className="blog-article-body">
          {copy.sections.map((s) => (
            <section key={s.h2}>
              <h2>{s.h2}</h2>
              {s.body.map((node, i) => (
                <p key={i}>{node}</p>
              ))}
            </section>
          ))}
        </div>
      </article>

      <footer className="blog-footer">
        <p className="footer-legal" style={{ marginTop: 40 }}>
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison ·{" "}
          <Link href={`/${lang}/mentions-legales`}>
            {lang === "fr" ? "Mentions légales" : "Legal notice"}
          </Link>{" "}
          ·{" "}
          <Link href={`/${lang}/confidentialite`}>
            {lang === "fr" ? "Confidentialité" : "Privacy"}
          </Link>
        </p>
      </footer>
    </>
  );
}
