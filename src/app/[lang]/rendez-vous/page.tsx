import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QuickContact from "@/components/QuickContact";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "../dictionaries";

const SITE_URL = "https://parrit.ai";

// Planning de rendez-vous Google Calendar (lien court calendar.app.google/kkpaNisBa78BuuAj8).
// Vue embarquée : gv=true. Le visiteur choisit un des créneaux proposés et réserve en un clic.
const SCHEDULE_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2HBmZmHiPcgY2v_EgpbDKJjMAovbOicgDd2cbFblBSM9NIC0qfXlyfLH6ubjE630_olQvmDWi-?gv=true";
const SCHEDULE_PUBLIC_URL = "https://calendar.app.google/kkpaNisBa78BuuAj8";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang as Locale);
  const m = dict.rendezvous.meta;

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/rendez-vous`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/rendez-vous`]),
      ),
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}/rendez-vous`,
      siteName: "Parrit.ai",
      locale: dict.meta.ogLocale,
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "Parrit.ai",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function RendezVous({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  const rdv = dict.rendezvous;

  return (
    <>
      <nav className="blog-nav">
        <Link href={`/${lang}`} className="nav-logo">
          Parrit.ai
        </Link>
        <div className="blog-nav-links">
          <Link href={`/${lang}/blog`} className="blog-nav-link">
            {dict.blog.navTitle}
          </Link>
          <Link href={`/${lang}/actualite`} className="blog-nav-link">
            {dict.actualite.navTitle}
          </Link>
        </div>
      </nav>

      <header className="blog-header">
        <p className="blog-header-label">{rdv.headerLabel}</p>
        <h1 className="blog-header-title">
          {rdv.headerTitleMain}{" "}
          <em className="hero-accent">{rdv.headerTitleAccent}</em>
        </h1>
        <p className="blog-header-subtitle">{rdv.headerSubtitle}</p>
      </header>

      <main className="rdv-main">
        <div className="rdv-embed">
          <iframe
            src={SCHEDULE_EMBED_URL}
            title={rdv.meta.title}
            loading="lazy"
          />
        </div>
        <p className="rdv-fallback">
          <a href={SCHEDULE_PUBLIC_URL} target="_blank" rel="noopener noreferrer">
            {rdv.openInTab}
          </a>
        </p>

        <section className="rdv-exit">
          <p className="rdv-exit-label">{rdv.exitLabel}</p>
          <h2 className="rdv-exit-title">{rdv.exitTitle}</h2>
          <p className="rdv-exit-subtitle">{rdv.exitSubtitle}</p>
          <QuickContact
            strings={dict.quickContact}
            page={`/${lang}/rendez-vous`}
            variant="light"
          />
        </section>
      </main>

      <footer className="blog-footer">
        <p className="footer-legal">
          © {new Date().getFullYear()} SASU PARRIT.AI · Rueil-Malmaison
        </p>
      </footer>
    </>
  );
}
