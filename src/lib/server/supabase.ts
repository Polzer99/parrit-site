import "server-only";

/**
 * ACCÈS SUPABASE, CÔTÉ SERVEUR UNIQUEMENT.
 *
 * `server-only` fait échouer le BUILD si ce module est importé depuis un
 * composant client. La clé de service ne peut donc pas fuir par accident dans un
 * bundle navigateur — la vérification est mécanique, pas déclarative.
 *
 * Pas de SDK : PostgREST se parle en HTTP, et un site vitrine n'a pas besoin
 * d'une dépendance de plus pour deux requêtes. `Prefer: return=representation`
 * nous rend la ligne écrite : c'est ce qui permet de ne répondre au visiteur
 * qu'APRÈS une persistance réellement confirmée, au lieu de faire confiance à
 * un code 200.
 *
 * RÈGLE DU PLAYBOOK (§33) : une variable d'environnement manquante est un arrêt
 * franc au démarrage, jamais un repli silencieux. Un lead perdu en silence coûte
 * plus cher qu'une route qui refuse de démarrer.
 */

export type ConfigSupabase = {
  url: string;
  cleService: string;
};

/** Lève si la configuration manque. L'appelant transforme ça en 5xx explicite. */
export function configSupabase(): ConfigSupabase {
  const url = process.env.SUPABASE_URL;
  const cleService = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const manquantes = [
    ["SUPABASE_URL", url],
    ["SUPABASE_SERVICE_ROLE_KEY", cleService],
  ]
    .filter(([, valeur]) => !valeur)
    .map(([nom]) => nom);

  if (manquantes.length > 0) {
    throw new Error(
      `Configuration Supabase absente : ${manquantes.join(", ")}. ` +
        "La capture est arrêtée plutôt que de perdre un lead en silence.",
    );
  }

  return { url: url!.replace(/\/$/, ""), cleService: cleService! };
}

/** Vrai si le serveur peut écrire. Sert à décider AVANT de promettre quoi que ce soit. */
export function persistanceDisponible(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

type OptionsRequete = {
  methode: "GET" | "POST" | "PATCH";
  chemin: string;
  corps?: unknown;
  /** `resolution=merge-duplicates` pour un upsert idempotent. */
  prefer?: string;
};

/**
 * Un appel PostgREST. Retourne les lignes renvoyées par la base — donc la preuve
 * que l'écriture a eu lieu. Lève avec le détail de l'erreur, jamais en silence.
 */
export async function requeteSupabase<T>({
  methode,
  chemin,
  corps,
  prefer,
}: OptionsRequete): Promise<T[]> {
  const { url, cleService } = configSupabase();

  const reponse = await fetch(`${url}/rest/v1/${chemin}`, {
    method: methode,
    headers: {
      apikey: cleService,
      Authorization: `Bearer ${cleService}`,
      "Content-Type": "application/json",
      Prefer: ["return=representation", prefer].filter(Boolean).join(","),
    },
    body: corps === undefined ? undefined : JSON.stringify(corps),
    cache: "no-store",
  });

  const texte = await reponse.text();

  if (!reponse.ok) {
    // Le détail de PostgREST est conservé : c'est lui qui dit POURQUOI, et un
    // échec muet est précisément ce qu'on cherche à supprimer.
    throw new Error(`supabase ${reponse.status} sur ${chemin} : ${texte.slice(0, 400)}`);
  }

  if (!texte) return [];
  return JSON.parse(texte) as T[];
}
