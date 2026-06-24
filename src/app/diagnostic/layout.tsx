import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Parler à Parrit : votre diagnostic sur-mesure | Parrit.ai",
  description:
    "Dites ce qui vous fait perdre du temps. Parrit vous rend un diagnostic sur vos deux fronts (back-office et business), adapté à votre métier, et vous l'envoie. Une conversation, pas un formulaire.",
  alternates: { canonical: `${SITE_URL}/diagnostic` },
  openGraph: {
    title: "Parler à Parrit : votre diagnostic sur-mesure",
    description:
      "Parlez à Parrit, obtenez un diagnostic concret sur vos deux fronts critiques. Le site fait tourner un agent, il ne vous montre pas une démo.",
    url: `${SITE_URL}/diagnostic`,
    siteName: "Parrit.ai",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Parrit.ai : l'IA qui agit pour vous, en 14 jours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Parler à Parrit : votre diagnostic sur-mesure",
    description:
      "Parlez à Parrit, obtenez un diagnostic concret sur vos deux fronts critiques. Le site fait tourner un agent, il ne vous montre pas une démo.",
    images: [OG_IMAGE],
  },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${body.variable} ${mono.variable}`}>
      <head>
        {/* PostHog : meme init que le reste du site, pour que le diagnostic soit auditable (events) par Hermes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture identify register register_once unregister opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing alias people.set people.set_once set_config get_config get_property reset group setPersonProperties".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
              posthog.init('phc_MBE1dFuCrRbroLzBdP7JtrH0O1JlH8F5uNs9cieSHqm', {
                api_host: 'https://eu.i.posthog.com',
                defaults: '2026-01-30',
                person_profiles: 'identified_only',
                session_recording: { maskAllInputs: true }
              });
            `,
          }}
        />
      </head>
      <body className="font-body bg-bg text-text antialiased min-h-screen">{children}</body>
    </html>
  );
}
