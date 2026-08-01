/**
 * CONTRAT VIDÉO — neutre vis-à-vis de l'hébergeur.
 *
 * Le choix de l'hébergeur n'est PAS tranché (TEMPLATE-GRAMMAR.md §8.4) : il
 * engage la règle §13 des règles d'or sur les runtimes tiers. Ce contrat existe
 * pour que le template vidéo ne dépende pas de cette décision.
 *
 * Règle : `T2Video` ne connaît qu'un `VideoAsset`. Il n'appelle aucune API
 * d'hébergeur, ne construit aucune URL d'embed, et ne teste jamais `provider`
 * pour changer son rendu. Changer d'hébergeur, ou en servir plusieurs en même
 * temps, se fait dans les adapters — pas dans le template.
 */

/**
 * Volontairement une chaîne libre et non une énumération fermée : fermer la
 * liste reviendrait à présélectionner les candidats, et à faire échouer la
 * compilation le jour où un autre est retenu.
 */
export type VideoProvider = string;

export type Chapitre = {
  /** Début, en secondes depuis le début de la vidéo. */
  debut: number;
  titre: string;
};

export type Sous_titres = {
  langue: string;
  /** URL du fichier WebVTT. */
  url: string;
  /** `true` si les sous-titres sont générés automatiquement et non relus. */
  automatique: boolean;
};

export type LigneTranscript = {
  /** Horodatage lisible, tel qu'affiché. */
  t: string;
  texte: string;
  /** Début en secondes, pour lier une ligne à un chapitre. */
  debut?: number;
};

/**
 * Le contrat. Tout ce dont une page vidéo a besoin, quel que soit l'hébergeur.
 *
 * Les quatre champs d'URL sont RÉSOLUS : c'est l'adapter qui les remplit, jamais
 * le template. Une donnée déjà complète n'a besoin d'aucun adapter.
 */
export type VideoAsset = {
  provider: VideoProvider;
  /** Identifiant chez l'hébergeur. Pour un fichier auto-hébergé : son chemin. */
  externalId: string;
  /** L'URL de référence, celle qu'on partage et qu'on met en `contentUrl`. */
  canonicalUrl: string;
  /** L'URL à charger dans le lecteur ou l'iframe. */
  embedUrl: string;
  /** Poster. Obligatoire : un lecteur sans poster est un rectangle noir. */
  thumbnail: string;
  /** Durée en secondes. Convertie en ISO 8601 pour `VideoObject.duration`. */
  duration: number;
  /** Le transcript est obligatoire : la page doit se lire sans la vidéo. */
  transcript: LigneTranscript[];
  chapters: Chapitre[];
  captions: Sous_titres[];
  publicationDate: string;
};

/**
 * Ce qu'une source fournit avant résolution. Les URL peuvent manquer : c'est le
 * travail de l'adapter de les construire.
 */
export type VideoSource = Omit<VideoAsset, "canonicalUrl" | "embedUrl" | "thumbnail"> & {
  canonicalUrl?: string;
  embedUrl?: string;
  thumbnail?: string;
};

/**
 * Un adapter traduit un identifiant d'hébergeur en URL. Il ne fait rien d'autre :
 * pas d'appel réseau, pas de clé d'API, pas de script tiers.
 */
export type VideoAdapter = {
  provider: VideoProvider;
  canonicalUrl: (externalId: string) => string;
  embedUrl: (externalId: string) => string;
  thumbnail: (externalId: string) => string;
};

/**
 * ⚠️ VIDE, ET C'EST VOLONTAIRE.
 *
 * Aucun hébergeur n'est retenu à ce stade. Enregistrer un adapter ici est un
 * choix d'architecture qui appartient à Paul, pas une commodité d'implémentation.
 *
 * Enregistrer un adapter le jour venu :
 *
 *   enregistrerAdapter({
 *     provider: "…",
 *     canonicalUrl: (id) => `…`,
 *     embedUrl:     (id) => `…`,
 *     thumbnail:    (id) => `…`,
 *   });
 *
 * Points à vérifier AVANT d'en enregistrer un :
 *   — le lecteur ne charge aucun script tiers au chargement de la page ;
 *   — aucune URL de runtime en `*.vercel.app` (règles d'or §13) ;
 *   — le poster est servi depuis notre domaine, pas depuis l'hébergeur ;
 *   — les sous-titres sont relus, pas seulement générés.
 */
const ADAPTERS = new Map<VideoProvider, VideoAdapter>();

export function enregistrerAdapter(adapter: VideoAdapter): void {
  ADAPTERS.set(adapter.provider, adapter);
}

export function getAdapter(provider: VideoProvider): VideoAdapter | undefined {
  return ADAPTERS.get(provider);
}

export function adaptersEnregistres(): VideoProvider[] {
  return [...ADAPTERS.keys()];
}

/**
 * Résout une source en asset complet.
 *
 * Deux chemins, et aucun ne dépend d'un hébergeur choisi :
 *  1. la source porte déjà ses trois URL → on les prend telles quelles ;
 *  2. sinon, on demande à l'adapter du provider.
 *
 * S'il n'y a ni URL ni adapter, on échoue avec un message qui nomme la décision
 * manquante — plutôt que de rendre un lecteur vide en production.
 */
export function resolveVideo(source: VideoSource): VideoAsset {
  const adapter = getAdapter(source.provider);

  const canonicalUrl = source.canonicalUrl ?? adapter?.canonicalUrl(source.externalId);
  const embedUrl = source.embedUrl ?? adapter?.embedUrl(source.externalId);
  const thumbnail = source.thumbnail ?? adapter?.thumbnail(source.externalId);

  if (!canonicalUrl || !embedUrl || !thumbnail) {
    throw new Error(
      `Vidéo « ${source.externalId} » : provider « ${source.provider} » sans adapter ` +
        `enregistré et sans URL fournies. L'hébergeur n'est pas tranché ` +
        `(TEMPLATE-GRAMMAR.md §8.4) : fournir canonicalUrl, embedUrl et thumbnail ` +
        `dans la donnée, ou enregistrer un adapter.`,
    );
  }

  if (source.transcript.length === 0) {
    throw new Error(
      `Vidéo « ${source.externalId} » sans transcript. Une page vidéo doit se lire ` +
        `sans la vidéo — c'est la condition du Structural Integrity Test.`,
    );
  }

  return { ...source, canonicalUrl, embedUrl, thumbnail };
}

/** Durée ISO 8601, exigée par `VideoObject.duration`. */
export function dureeISO(secondes: number): string {
  const h = Math.floor(secondes / 3600);
  const m = Math.floor((secondes % 3600) / 60);
  const s = secondes % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s}S`;
}

/** Durée lisible, pour la ligne de métadonnées. */
export function dureeLisible(secondes: number): string {
  const m = Math.floor(secondes / 60);
  const s = secondes % 60;
  return `${m} min ${String(s).padStart(2, "0")}`;
}
