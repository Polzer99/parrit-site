/**
 * GRAMMAIRE DE PAGES PARRIT.AI — huit templates, un point d'entrée.
 *
 * Contrat complet : ~/parrit-os/site-lead-engine/_parallel/TEMPLATE-GRAMMAR.md
 *
 * Un template est un ASSEMBLAGE de composants existants piloté par la donnée.
 * Aucun de ces fichiers ne définit une couleur, une taille de police, un rayon
 * ni une ombre : tout passe par `src/styles/parrit-tokens.css`.
 *
 * La homepage n'est PAS un template : c'est une composition modulaire des mêmes
 * sections. Si une section de la homepage réclame un composant inédit, c'est
 * qu'un des huit templates est incomplet.
 */

export { T1Article, type ArticleData } from "./T1Article";
export { T2Video, type VideoData } from "./T2Video";
export {
  resolveVideo,
  enregistrerAdapter,
  type VideoAsset,
  type VideoSource,
  type VideoAdapter,
} from "@/lib/video/contract";
export { T3Ressource } from "./T3Ressource";
export { T4Systeme, type SystemeData } from "./T4Systeme";
export { T5Theme, type ThemeData } from "./T5Theme";
export {
  T6Presse,
  type PresseData,
  type FaitSociete,
  type MentionPresse,
  type Citation,
  type VisuelPresse,
} from "./T6Presse";
export { T7Landing, type CampagneData } from "./T7Landing";
export { T8Auteur, type AuteurData } from "./T8Auteur";

export {
  CtaBlock,
  CtaInline,
  ContenusLies,
  JsonLd,
  LimitesBlock,
  MetaLine,
  PageBody,
  ProofBlock,
  ProofRail,
  type LienContenu,
} from "./parts";
