// Canonical geometry and stories: docs/hero-trois-plans, 29/10/2026.
export const ROWS = [
  [-0.8, -0.95],
  [-1.55, 0],
  [-0.8, 0],
  [-0.8, 0.95],
  [0, -0.95],
  [0, 0],
  [0, 0.95],
  [0.8, -0.95],
  [1.55, 0],
  [0.8, 0],
  [0.8, 0.95],
] as const;

export const NODES = {
  top: [
    ["syn", "Synthèse de réunion", "bot"],
    ["rech", "Recherche documentaire", "bot"],
    ["rep", "Réponse client", "bot"],
    ["ast", "Assistant e-mails", "bot"],
    ["treso", "Trésorerie", "chart"],
    ["ecarts", "Écarts de contrat", "chart"],
    ["retards", "Retards de paiement", "chart"],
    ["relances", "Relances", "gear"],
    ["suivi", "Suivi des actions", "gear"],
    ["saisie", "Saisie des factures", "gear"],
    ["majerp", "Mise à jour ERP", "gear"],
  ],
  mid: [
    ["devis", "Devis", "cube"],
    ["recl", "Réclamation", "cube"],
    ["client", "Client", "person"],
    ["commande", "Commande", "cube"],
    ["paiement", "Paiement", "cube"],
    ["facture", "Facture", "cube"],
    ["contrat", "Contrat", "cube"],
    ["fournisseur", "Fournisseur", "person"],
    ["stock", "Stock", "cube"],
    ["equipe", "Équipe", "person"],
    ["action", "Action", "cube"],
  ],
  bot: [
    ["mails", "E-mails", "mail"],
    ["cr", "Comptes rendus", "doc"],
    ["factures", "Factures", "doc"],
    ["contrats", "Contrats", "doc"],
    ["cgv", "Conditions générales", "rule"],
    ["echeances", "Échéances", "rule"],
    ["procedures", "Procédures", "rule"],
    ["messagerie", "Messagerie", "tool"],
    ["agenda", "Agenda", "cal"],
    ["erp", "ERP", "tool"],
    ["ged", "Gestion documentaire", "tool"],
  ],
} as const;

export const ZONES = {
  top: ["ASSISTANTS ET RÉDACTION", "ANALYSES", "AUTOMATISATIONS ET AGENTS"],
  mid: ["COMMERCIAL", "FINANCE ET JURIDIQUE", "OPÉRATIONS ET ÉQUIPES"],
  bot: ["SOURCES DE DONNÉES", "SOURCES DE LOGIQUE", "SYSTÈMES D'ACTION"],
} as const;

export const LAYERS = {
  top: ["ANALYSES · SOLUTIONS", "ce que vous obtenez"],
  mid: ["ONTOLOGIE", "votre entreprise en objets reliés"],
  bot: ["SOURCES", "ce que vous avez déjà"],
} as const;

export const REL = [
  ["client", "devis"],
  ["client", "commande"],
  ["client", "recl"],
  ["commande", "facture"],
  ["facture", "paiement"],
  ["client", "facture"],
  ["contrat", "client"],
  ["contrat", "fournisseur"],
  ["fournisseur", "stock"],
  ["commande", "stock"],
  ["equipe", "action"],
  ["action", "client"],
  ["equipe", "contrat"],
  ["devis", "commande"],
  ["recl", "commande"],
] as const;

export const UP = [
  ["mails", "client"],
  ["mails", "recl"],
  ["cr", "action"],
  ["factures", "facture"],
  ["factures", "paiement"],
  ["contrats", "contrat"],
  ["cgv", "commande"],
  ["cgv", "devis"],
  ["echeances", "facture"],
  ["echeances", "paiement"],
  ["procedures", "contrat"],
  ["procedures", "action"],
  ["messagerie", "client"],
  ["erp", "commande"],
  ["erp", "fournisseur"],
  ["erp", "stock"],
  ["agenda", "equipe"],
  ["ged", "contrat"],
  ["cr", "equipe"],
  ["procedures", "recl"],
] as const;

export const TOP = [
  ["client", "rep"],
  ["client", "ast"],
  ["action", "syn"],
  ["contrat", "rech"],
  ["paiement", "treso"],
  ["facture", "retards"],
  ["contrat", "ecarts"],
  ["facture", "relances"],
  ["action", "suivi"],
  ["facture", "saisie"],
  ["commande", "majerp"],
  ["stock", "majerp"],
  ["recl", "rep"],
  ["recl", "rech"],
] as const;

export const HERO_STORIES = [
{ title: "Un client attend une réponse", d: "mails", o1: "client", o2: "commande", rel: "rel_client_commande", r: "cgv", rl: "up_cgv_commande", out: "rep", top: "top_client_rep", result: "Réponse prête", act: "messagerie", al: "up_messagerie_client", verb: "Vous validez", side: "right", steps: ["un client écrit", "le système le relie à sa commande", "un agent applique vos conditions", "vous validez, la réponse part"] },
{ title: "Une facture n'est pas payée", d: "factures", o1: "facture", o2: "client", rel: "rel_client_facture", r: "echeances", rl: "up_echeances_facture", out: "relances", top: "top_facture_relances", result: "Relance prête", act: "messagerie", al: "up_messagerie_client", verb: "Vous validez", side: "left", steps: ["la facture est échue", "le système la relie au client", "un agent applique vos échéances", "vous validez, la relance part"] },
{ title: "Un contrat arrive", d: "contrats", o1: "contrat", o2: "fournisseur", rel: "rel_contrat_fournisseur", r: "procedures", rl: "up_procedures_contrat", out: "ecarts", top: "top_contrat_ecarts", result: "Écarts signalés", act: "erp", al: "up_erp_fournisseur", verb: "Vous décidez", side: "right", steps: ["le contrat est reçu", "le système le relie au fournisseur", "un agent le compare à vos procédures", "vous décidez, l'ERP est à jour"] },
{ title: "Une réclamation qualité arrive", d: "mails", o1: "recl", o2: "commande", rel: "rel_recl_commande", r: "procedures", rl: "up_procedures_recl", out: "rech", top: "top_recl_rech", result: "Cause identifiée", act: "erp", al: "up_erp_commande", verb: "Vous décidez", side: "left", steps: ["un client signale un défaut", "le système le relie à sa commande", "un agent applique vos procédures qualité", "vous décidez, l'ERP lance la correction"] }
] as const;
export type Plane = keyof typeof NODES;
export type NodeId = (typeof NODES)[Plane][number][0];
export type GlyphName = (typeof NODES)[Plane][number][2];
