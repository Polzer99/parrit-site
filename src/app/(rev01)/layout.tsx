import type { Metadata } from "next";

import "../../system/fonts.css";
import "../../system/tokens.css";
import "../../system/system.css";
import "./rev01.css";

import { AnalyticsInit, RevHeader } from "@/system/components";

/* PostHog — standard global de tracking (décision Paul 15/08) : autocapture,
   heatmaps, session replay (inputs masqués), web vitals. Clé projet publique. */
/* JSON-LD Organization — graphe d'entités Google/IA : relie parrit.ai, le
   fondateur et paul-larmaraud.com. Compléter sameAs quand la page LinkedIn
   entreprise existera. */
const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PARRIT.AI",
  url: "https://parrit.ai",
  logo: "https://parrit.ai/icon.png",
  description:
    "Parrit designs and builds company operating systems — commissioned, not subscribed. Based in Lille, France; operating internationally in English and French.",
  founder: {
    "@type": "Person",
    name: "Paul Larmaraud",
    url: "https://paul-larmaraud.com",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Rueil-Malmaison",
    addressCountry: "FR",
  },
  sameAs: ["https://paul-larmaraud.com"],
});

const POSTHOG_SNIPPET = `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias register register_once unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group setPersonProperties setPersonPropertiesForFlags resetPersonPropertiesForFlags on onSessionId get_session_id get_session_replay_url get_distinct_id startSessionRecording stopSessionRecording captureException set_config debug init".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('phc_MBE1dFuCrRbroLzBdP7JtrH0O1JlH8F5uNs9cieSHqm', {
  api_host: 'https://eu.i.posthog.com',
  defaults: '2026-01-30',
  person_profiles: 'identified_only',
  rageclick: true,
  capture_dead_clicks: true,
  session_recording: { maskAllInputs: true }
});
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://parrit.ai"),
  title: {
    default: "Parrit — Company Operating Systems",
    template: "%s · Parrit",
  },
  description:
    "Parrit examines how a company operates, builds its first production system and compounds it as owned infrastructure.",
};

export default function Rev01Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/rev02/GeneralSans-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/rev02/GeneralSans-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/rev02/JetBrainsMono-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script dangerouslySetInnerHTML={{ __html: POSTHOG_SNIPPET }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORG_JSONLD }} />
      </head>
      <body>
        <AnalyticsInit />
        <RevHeader />
        {children}
      </body>
    </html>
  );
}
