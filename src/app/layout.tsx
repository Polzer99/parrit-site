import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parrit.ai — Je cartographie vos blocages, je deploie de l'IA",
  description:
    "Vos process repetitifs vous coutent plus cher que vous ne pensez. Je deploie de l'IA qui change la vitesse d'execution. En semaines, pas en mois. Paul Larmaraud.",
  keywords: [
    "IA entreprise",
    "automatisation processus",
    "agents IA",
    "SAP IA",
    "CRM automatise",
    "consulting IA",
    "Parrit.ai",
    "Paul Larmaraud",
    "deploiement IA",
    "transformation digitale",
  ],
  authors: [{ name: "Paul Larmaraud" }],
  openGraph: {
    title: "Parrit.ai — Je cartographie vos blocages, je deploie de l'IA",
    description:
      "Vos process repetitifs vous coutent plus cher que vous ne pensez. Prototypage en 48h, deploiement inclus.",
    url: "https://parrit.ai",
    siteName: "Parrit.ai",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parrit.ai — Je cartographie vos blocages, je deploie de l'IA",
    description:
      "Vos process repetitifs vous coutent plus cher que vous ne pensez. Prototypage en 48h, deploiement inclus.",
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
      "Je cartographie vos blocages, je deploie de l'IA qui change la vitesse d'execution. En semaines, pas en mois.",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rueil-Malmaison",
      addressCountry: "FR",
    },
    founder: [{ "@type": "Person", name: "Paul Larmaraud" }],
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
      <body className={`${poppins.className} min-h-screen`}>{children}</body>
    </html>
  );
}
