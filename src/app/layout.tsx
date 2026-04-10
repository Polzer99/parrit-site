import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const heading = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-heading",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parrit.ai \u2014 Solutions d\u2019automatisation intelligente pour les entreprises",
  description:
    "Votre entreprise, avec deux fois moins de t\u00e2ches r\u00e9p\u00e9titives d\u00e8s aujourd\u2019hui. Automatisation des processus par IA. Entreprise fran\u00e7aise.",
  keywords: [
    "IA entreprise",
    "automatisation processus",
    "agents IA",
    "SAP IA",
    "CRM automatis\u00e9",
    "consulting IA",
    "Parrit.ai",
    "Paul Larmaraud",
    "d\u00e9ploiement IA",
    "transformation digitale",
  ],
  authors: [{ name: "Paul Larmaraud" }],
  openGraph: {
    title: "Parrit.ai \u2014 Vos \u00e9quipes m\u00e9ritent mieux que le copier-coller",
    description:
      "Agents IA sur mesure pour automatiser vos processus r\u00e9p\u00e9titifs. Diagnostic gratuit en 15 minutes.",
    url: "https://parrit.ai",
    siteName: "Parrit.ai",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://parrit.ai/og-image.png",
        width: 1200,
        height: 630,
        alt: "Parrit.ai \u2014 Automatisation intelligente pour les entreprises",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrit.ai \u2014 Vos \u00e9quipes m\u00e9ritent mieux que le copier-coller",
    description:
      "Agents IA sur mesure pour automatiser vos processus r\u00e9p\u00e9titifs. Diagnostic gratuit en 15 minutes.",
    images: ["https://parrit.ai/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Parrit.ai",
    legalName: "SASU PARRIT.AI",
    url: "https://parrit.ai",
    description:
      "Solutions d\u2019automatisation intelligente pour les entreprises. Deux fois moins de t\u00e2ches r\u00e9p\u00e9titives d\u00e8s aujourd\u2019hui.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    founder: [
      { "@type": "Person", name: "Paul Larmaraud" },
      { "@type": "Person", name: "Yukun Leng" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "paul@parrit.ai",
      contactType: "sales",
    },
  };

  return (
    <html lang="fr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* PostHog Analytics */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing disable start_session_recording stop_session_recording session_recording_started is_session_recording_started loadToolbar get_property getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_PLACEHOLDER', {api_host: 'https://eu.i.posthog.com'});
            `,
          }}
        />
      </head>
      <body
        className={`${body.variable} ${heading.variable} min-h-screen`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
