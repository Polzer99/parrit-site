import type { Metadata } from "next";

const SITE_URL = "https://parrit.ai";
const OG_IMAGE = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Diviser ses coûts IA par 20 : le harnais | Parrit.ai",
  description:
    "Comment Parrit a divisé ses coûts IA par 20, mesuré sur sa propre activité. Le playbook, la matrice tâche → modèle et le calculateur, appliqués à votre stack.",
  alternates: { canonical: `${SITE_URL}/harnais-ia` },
  openGraph: {
    title: "Diviser ses coûts IA par 20 : le harnais",
    description:
      "Étude de cas interne mesurée : router chaque tâche vers le modèle le moins cher qui fait le travail, garder le frontier pour les 10 % critiques.",
    url: `${SITE_URL}/harnais-ia`,
    siteName: "Parrit.ai",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Parrit.ai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diviser ses coûts IA par 20 : le harnais",
    description:
      "Mesuré sur notre propre activité : −95 % de coût IA en routant chaque tâche vers le bon modèle.",
    images: [OG_IMAGE],
  },
};

const gateCss = `
.gate{position:relative;margin-top:44px}
.gate-content{filter:blur(6px);opacity:.5;pointer-events:none;user-select:none;
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 34%,transparent 90%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 34%,transparent 90%);
  transition:filter .4s ease,opacity .4s ease}
.gate-content.unblurred{filter:none;opacity:1;-webkit-mask-image:none;mask-image:none;pointer-events:auto}
.gate-capture{position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);
  width:min(460px,94%);z-index:5;background:var(--surface);border:1px solid var(--line);
  border-radius:20px;padding:40px 38px;box-shadow:var(--shadow-lg);overflow:hidden}
.gate-capture .seal{width:42px;height:42px;font-size:22px;border-radius:9px;margin-bottom:18px}
.gate-capture h3{font-size:24px;font-weight:800;letter-spacing:-.018em;line-height:1.18;color:var(--ink)}
.gate-capture .cap-sub{font-family:var(--mono);font-size:12.5px;color:var(--muted);margin-top:12px;line-height:1.65}
.gate-capture .leadform{flex-direction:column;margin-top:22px;max-width:none}
.gate-capture .leadform input{flex:1 1 100%}
.gate-capture .leadform .btn{width:100%;justify-content:center;padding:14px}
.gate-capture .fine{font-family:var(--mono);font-size:11px;color:var(--faint);text-align:center;margin-top:14px;line-height:1.5}
.gate-capture .seal-wm{position:absolute;bottom:-30px;right:-26px;width:180px;opacity:.06;transform:rotate(-4deg)}
.gate-ok{text-align:center;font-family:var(--mono);font-size:13px;color:var(--ink);margin-top:6px;line-height:1.6}
.matrix{width:100%;border-collapse:collapse;margin-top:18px;font-family:var(--mono);font-size:12.5px}
.matrix th,.matrix td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line)}
.matrix th{color:var(--faint);text-transform:uppercase;letter-spacing:.06em;font-size:11px}
.matrix td b{color:var(--red)}
`;

export default function HarnaisLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/da/parrit-da.css" />
        <style dangerouslySetInnerHTML={{ __html: gateCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
