import { NextRequest, NextResponse } from "next/server";

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

}

export const config = {
  matcher: [
    "/camp-costa-rica/:path*",
    {
      source: "/:path*",
      has: [{ type: "host", value: "campparrita.com" }],
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.campparrita.com" }],
    },
  ],
};
