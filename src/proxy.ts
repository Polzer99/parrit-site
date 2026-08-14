import { NextRequest, NextResponse } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["fr", "en", "pt-BR", "zh-CN"] as const;
const defaultLocale = "fr";

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, locales as unknown as string[], defaultLocale);
  } catch {
    return defaultLocale;
  }
}

// Domaine dédié du Camp Parrita : sert la landing camp à la racine,
// sans jamais exposer l'arborescence parrit.ai.
const CAMP_HOST = "campparrita.com";
const CAMP_PATH = "/camp-costa-rica";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") ?? "").split(":")[0];

  // campparrita.com → la page camp, en conservant le sous-chemin de langue
  // (/ → FR, /en, /es ; assets/_next passent déjà hors matcher).
  if (host === CAMP_HOST || host === `www.${CAMP_HOST}`) {
    if (pathname === CAMP_PATH || pathname.startsWith(`${CAMP_PATH}/`)) return;
    const url = request.nextUrl.clone();
    url.pathname = `${CAMP_PATH}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // parrit.ai/camp-costa-rica : servi tel quel tant que le domaine dédié
  // n'est pas actif. Une fois campparrita.com rattaché au projet Vercel,
  // remplacer ce return par un redirect 308 vers https://campparrita.com/.
  if (pathname === CAMP_PATH || pathname.startsWith(`${CAMP_PATH}/`)) {
    return;
  }

  // REV 01 pages are intentionally outside the legacy locale tree.
  if (
    pathname === "/" ||
    pathname === "/standard" ||
    pathname === "/commission" ||
    pathname === "/paul" ||
    pathname === "/maxime" ||
    pathname === "/legal"
  ) {
    return;
  }

  // Si le chemin commence déjà par une locale, on laisse passer
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return;

  // Sinon on redirige vers la locale préférée
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // On skip les internals Next, les assets statiques, les fichiers publics,
    // et l'OS interne (hors i18n)
    // `art-direction-lab` : laboratoire interne hors i18n, comme design-system.
    // `template-grammar` : specimen interne des huit templates, même régime.
    // ⚠️ Toute route hors i18n DOIT être ajoutée ici, sinon elle est redirigée
    // vers /fr/<route> qui n'existe pas — c'est la cause exacte du 404 de
    // /efi-audit-energie (02-ROUTES-CTA-AND-LEAD-MAGNETS.md §D.1).
    "/((?!_next|api|os|system|paul|maxime|legal|fondateurs|academy|chemin|metiers|harnais-ia|outils|diagnostic|design-system|template-grammar|art-direction-lab|demarrer-claude-code|architecture-claude-md|efi-audit-hotels|hr-radar|favicon.ico|robots.txt|sitemap.xml|og-image.png|.*\\..*).*)",
  ],
};
