import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AttributionInit from "@/components/AttributionInit";
import CtaTracker from "@/components/CtaTracker";
import EngagementTracker from "@/hooks/useEngagement";
import {
  getDictionary,
  hasLocale,
  locales,
  type Locale,
} from "./dictionaries";

const body = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://parrit.ai";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export async function generateStaticParams() {
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
  const m = dict.meta;

  const languagesMap: Record<string, string> = {
    "x-default": `${SITE_URL}/fr`,
  };
  locales.forEach((l) => {
    languagesMap[l] = `${SITE_URL}/${l}`;
  });

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "Paul Larmaraud" }],
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: languagesMap,
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      url: `${SITE_URL}/${lang}`,
      siteName: "Parrit.ai",
      locale: m.ogLocale,
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Parrit.ai : diagnostic IA avant transformation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: m.ogTitle,
      description: m.ogDescription,
      images: [OG_IMAGE],
    },
    icons: {
      icon: "/icon.svg",
      apple: "/apple-icon.png",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Parrit.ai",
        legalName: "SASU PARRIT.AI",
        url: SITE_URL,
        description: dict.meta.schemaDescription,
        foundingDate: "2024",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rueil-Malmaison",
          addressCountry: "FR",
        },
        founder: [
          {
            "@type": "Person",
            name: "Paul Larmaraud",
            jobTitle: "Fondateur",
            email: "paul.larmaraud@parrit.ai",
          },
          { "@type": "Person", name: "Yukun Leng", jobTitle: "Co-fondatrice" },
        ],
        contactPoint: {
          "@type": "ContactPoint",
          email: "paul.larmaraud@parrit.ai",
          contactType: "sales",
          availableLanguage: ["French", "English", "Portuguese"],
        },
        areaServed: ["France", "Europe", "Asia"],
        knowsAbout: [
          "Produits IA",
          "Conseil augmenté par Claude Code",
          "Claude Code",
          "Anthropic Claude",
          "Automatisation IA",
          "Agents IA",
          "Intégration API",
          "Prototypage rapide",
          "n8n",
        ],
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#transformation-ia`,
        name: "Transformation IA",
        serviceType: "Transformation IA · Operating Partner",
        url: `${SITE_URL}/fr/croissance`,
        description:
          "Accompagnement Operating Partner pour cartographier les processus, prioriser les workflows à fort impact et transformer l'entreprise avec des agents IA dans la durée.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "FR",
        audience: {
          "@type": "BusinessAudience",
          audienceType: "Fondateurs et directeurs généraux",
        },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#agent-ia`,
        name: "Agent IA · Sprint agentique",
        serviceType: "Déploiement de systèmes agentiques",
        url: `${SITE_URL}/fr/deployer`,
        description:
          "Un agent en production, connecté aux outils métier et opéré avec garde-fous : un workflow critique transformé en système agentique utilisable.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "FR",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#formation-agentique`,
        name: "Formation agentique (non-tech)",
        serviceType: "Formation IA non-tech",
        url: `${SITE_URL}/fr/transmettre`,
        description:
          "Formation non-tech finançable OPCO pour rendre les équipes autonomes sur Claude Code, Codex et les outils agentiques.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "FR",
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#la-veille`,
        name: "La Veille",
        serviceType: "Veille agentique · produit d'appel",
        description:
          "Produit d'appel Parrit : un agent qui scanne chaque matin les signaux stratégiques de votre marché et vous les remonte, point d'entrée vers la transformation.",
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: "FR",
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Parrit.ai",
        description: dict.meta.schemaDescription,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["fr", "en", "pt-BR"],
      },
      {
        "@type": "HowTo",
        "@id": `${SITE_URL}/#methode`,
        name: dict.approach.title,
        description: dict.approach.description,
        inLanguage: lang,
        step: dict.approach.pillars.map((p, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: p.title,
          text: p.desc,
        })),
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: "Parrit.ai",
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Rueil-Malmaison",
          addressRegion: "Île-de-France",
          addressCountry: "FR",
        },
        areaServed: ["France", "Europe", "Asia"],
        serviceType: "Audit, déploiement et formation agentique",
      },
    ],
  };

  return (
    <html lang={lang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* PostHog Analytics: autocapture + heatmaps + session replay + web vitals (defaults 2026-01-30) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="Ei Ni init zi Gi Nr Ui Xi Hi capture calculateEventProperties tn register register_once register_for_session unregister unregister_for_session an getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync ln identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty nn Qi createPersonProfile setInternalOrTestUser sn qi cn opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Ji debug Fr rn getPageViewId captureTraceFeedback captureTraceMetric Bi".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_MBE1dFuCrRbroLzBdP7JtrH0O1JlH8F5uNs9cieSHqm', {
                api_host: 'https://eu.i.posthog.com',
                defaults: '2026-01-30',
                person_profiles: 'identified_only',
                rageclick: true,
                capture_dead_clicks: true,
                session_recording: { maskAllInputs: true }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${body.variable} ${mono.variable} min-h-screen`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <AttributionInit />
        <CtaTracker />
        <EngagementTracker />
        {children}
      </body>
    </html>
  );
}
