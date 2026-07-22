import type { Metadata } from "next";

const SITE_URL = "https://parrit.ai";
const CAMP_URL = "https://campparrita.com";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Camp Parrita : immersion entrepreneuriale au Costa Rica | Parrit",
  description:
    "10 jours au Costa Rica sans téléphone, budget minuscule, un business à créer sur place. Le camp qui provoque le déclic entrepreneurial chez les jeunes adultes. 8 places par cohorte, admission sur candidature.",
  alternates: { canonical: CAMP_URL },
  openGraph: {
    title: "Camp Parrita : le déclic entrepreneurial, au Costa Rica",
    description:
      "10 jours sans téléphone, un business à créer en partant de rien, un encadrement invisible mais permanent. La métamorphose que ni les études ni un stage ne donnent.",
    url: CAMP_URL,
    siteName: "Parrit.ai",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Camp Parrita" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Camp Parrita : le déclic entrepreneurial, au Costa Rica",
    description:
      "10 jours sans téléphone, un business à créer en partant de rien. 8 places par cohorte.",
    images: [OG_IMAGE],
  },
};

const campCss = `
.faq-list{margin-top:44px;border-top:1px solid var(--line)}
.faq-item{border-bottom:1px solid var(--line)}
.faq-item summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;
  padding:20px 4px;font-weight:700;font-size:17px;letter-spacing:-.012em;color:var(--ink)}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:"+";font-family:var(--mono);font-size:18px;color:var(--red);flex:none}
.faq-item[open] summary::after{content:"−"}
.faq-item p{font-family:var(--mono);font-size:13.5px;line-height:1.75;color:var(--muted);padding:0 4px 22px;max-width:820px}
.apply-card{max-width:640px;margin:40px auto 0;background:var(--surface);border:1px solid var(--line);
  border-radius:20px;padding:36px 34px;box-shadow:var(--shadow-lg)}
.apply-form{display:flex;flex-direction:column;gap:12px}
.apply-row{display:flex;gap:12px;flex-wrap:wrap}
.apply-row input,.apply-row select{flex:1 1 220px}
.apply-form input,.apply-form select,.apply-form textarea{font-family:var(--mono);font-size:13.5px;color:var(--ink);
  background:var(--bg);border:1px solid var(--line);border-radius:10px;padding:13px 15px;outline:none;width:100%}
.apply-form textarea{resize:vertical}
.apply-form .btn{width:100%;justify-content:center;padding:15px;margin-top:4px}
.apply-form .fine{font-family:var(--mono);font-size:11px;color:var(--faint);text-align:center;margin-top:4px}
.apply-error{font-family:var(--mono);font-size:12.5px;color:var(--red);text-align:center}
.gate-ok{text-align:center;font-family:var(--mono);font-size:14px;color:var(--ink);line-height:1.7;margin:10px 0}
.card .kicker{display:block;margin-bottom:10px}
`;

export default function CampLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/da/parrit-da.css" />
        <style dangerouslySetInnerHTML={{ __html: campCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
