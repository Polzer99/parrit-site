---
document: 12-USE-CASE-PROOF-PLAN
status: living
version: 1.0.0
updated: 2026-08-02
owner: Paul Larmaraud
registre: INTERNAL
---

# 12 · Plan d'instrumentation des cas étendards

Plan pour faire passer les quatre cas de `11-FLAGSHIP-USE-CASES.md` d'`OBSERVÉ` à `PROUVÉ`. Sans ce plan, les quatre cas restent des descriptions de méthode, ce qui est déjà publiable, mais aucun n'autorise une affirmation de résultat.

**Le premier résultat client mesuré est la condition écrite dans `00A` §9, `00B` §4 et `03` §13.** C'est le seul manque qui plafonne tout le reste.

## Tableau d'instrumentation

| Cas | Métrique principale | Baseline | Source de données | Événement à tracer | Responsable | Fréquence | 30 jours | 60 jours | 90 jours | Autorisation client | État de preuve |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **1 · Reporting** | Délai entre réception de l'export et validation du document | **Inconnue.** À reconstituer sur trois périodes passées avant tout démarrage | Horodatage de dépôt de l'export, horodatage de la validation | `export_recu`, `reclassement_termine`, `compte_ambigu_signale`, `document_valide` | Paul | À chaque clôture | Baseline reconstituée, compteur posé | 2 périodes mesurées | 3 périodes, écart calculé | **Oui**, données comptables | `À MESURER` |
| **1 · Reporting, fiabilité** | Nombre de comptes qui ne se recomposent pas | **114**, connue | Contrôle de recomposition | `recomposition_echouee` | Paul | À chaque exécution | Cause identifiée | Sous 20 | 0, contrôle bloquant | Oui | `PROUVÉ` sur la baseline |
| **2 · Cabinet** | Taux de messages rattachés au bon dossier sans correction | **Inconnue** | Table de relances, après ajout d'une colonne d'auteur | `message_recu`, `dossier_rattache`, `proposition_presentee`, `validation`, `envoi` | Paul | Hebdomadaire | Colonne d'auteur ajoutée, flux redémarré | 4 semaines de données | Taux calculé sur 8 semaines | **Oui**, secret professionnel | `À MESURER` |
| **2 · Cabinet, activité** | Relances envoyées après validation | **103 événements**, arrêtés le 06/07 | Table de relances | `relance_validee`, `relance_envoyee` | Paul | Hebdomadaire | Cause de l'arrêt identifiée | Flux stable 4 semaines | Série continue | Oui | `OBSERVÉ` |
| **3 · CRM** | Utilisateurs actifs par semaine | **Inconnue** | Journaux applicatifs, à activer | `session_ouverte`, `action_enregistree`, `notification_traitee` | Paul, après reprise des accès | Hebdomadaire | Accès serveur repris, journaux activés | 4 semaines | Série sur 8 semaines | **Oui** | `À MESURER` |
| **3 · CRM, usage terrain** | Actions commerciales enregistrées depuis la messagerie | **Inconnue** | Journaux du connecteur | `action_depuis_messagerie` | Paul | Hebdomadaire | Compteur posé | Première série | Comparaison avec les actions hors messagerie | Oui | `À MESURER` |
| **4 · Croissance** | Rendez-vous qualifiés dont l'origine est attribuée | **0 attribué**, connue | Base de prospects, avec champ d'origine obligatoire | `signal_capte`, `signal_qualifie`, `approche_validee`, `envoi`, `reponse`, `rdv`, `origine` | Paul | Mensuelle | Champ d'origine rendu obligatoire | Premier mois complet | Trois mois, taux calculé | Non, données internes | `À MESURER` |
| **4 · Croissance, source** | Signaux captés par semaine | **0 depuis le 19/05**, connue | Table de signaux | `signal_capte` | Paul | Hebdomadaire | Source remplacée ou dossier archivé | Flux ou décision d'arrêt | Décision tranchée | Non | `PROUVÉ` sur l'arrêt |

**Sur la colonne responsable.** Paul est nommé partout, ce qui est un constat, pas un choix d'organisation : aucune autre personne n'est aujourd'hui en mesure de poser ou de lire ces compteurs. C'est en soi un risque du plan.

## Données manquantes

**Cas 1.** La chronologie du processus avant intervention, sans laquelle aucun gain de délai n'est écrivable. Le périmètre exact de la situation de référence. La cause des 114 comptes qui ne se recomposent pas.

**Cas 2.** L'auteur de chaque décision, absent de la table. La raison de l'arrêt du 6 juillet. L'accès au serveur pour observer l'exécution. Le rattachement entre une relance et un revenu, qui n'existe nulle part et sans lequel toute affirmation de chiffre d'affaires est interdite.

**Cas 3.** Les accès serveur, dont la clé n'est pas détenue par Paul. Les journaux d'usage, non activés. Le statut de signature de deux documents contractuels, illisibles au-delà de la première page.

**Cas 4.** L'attribution de bout en bout, du signal jusqu'à l'affaire. Une source de signaux vivante. Le coût réel par rendez-vous, jamais calculé.

**Transversal.** Le coût d'exploitation mensuel de chaque système, inconnu sur les quatre. Il conditionne toute vente de RUN.

## Modifications techniques nécessaires

1. **Cas 2 : ajouter une colonne d'auteur** à la table de relances. C'est la modification la plus petite et la plus déterminante du plan : sans elle, le partage des décisions entre l'humain et le système reste invérifiable, et l'autonomie ne peut pas être démontrée.
2. **Cas 2 : une supervision qui alerte à l'arrêt du flux.** L'arrêt de juillet est passé inaperçu.
3. **Cas 1 : un contrôle bloquant sur la recomposition**, qui empêche la production d'un document quand un total ne tombe pas.
4. **Cas 3 : reprendre les accès serveur**, puis activer les journaux applicatifs. Bloquant.
5. **Cas 4 : rendre le champ d'origine obligatoire** à la création d'un prospect, et interdire la fermeture d'une affaire sans origine renseignée.
6. **Transversal : un compteur de coût par système**, relevé mensuellement.
7. **Transversal : un tableau de bord unique** des huit métriques ci dessus. C'est la première fonction utile de la couche de supervision interne, et elle reste interne.

## Témoignages à demander

| Cas | À qui | Ce qu'on demande | Ce qu'on ne demande pas |
|---|---|---|---|
| 1 | Au référent qui produit le reporting | Ce qui a changé dans son travail, dans ses mots | Un chiffre de gain de temps qu'il n'a pas mesuré |
| 2 | Au dirigeant | Ce que le rattachement lui évite | Une affirmation sur son chiffre d'affaires |
| 3 | Au dirigeant et à un utilisateur terrain | Pourquoi le système correspond à leur métier | Une comparaison avec un logiciel du marché qu'ils n'ont pas essayé |
| 4 | Aucun | Ce cas se raconte à la première personne, sans témoignage | |

**Règle.** Un témoignage se demande après une mesure, pas à la place d'une mesure. Un client qui dit « on gagne du temps » ne remplace pas un compteur, et cette phrase ne s'écrit pas comme un résultat.

## Captures et démonstrations à produire

| Cas | À capturer | Pourquoi |
|---|---|---|
| 1 | Un compte que le système refuse de classer et remonte à l'humain | C'est la démonstration du discernement, pas du calcul |
| 1 | Le contrôle de recomposition qui bloque | Montre une discipline, pas une intention |
| 2 | Un message sans référence, et le dossier retrouvé avec sa justification | C'est le cœur agentique du cas |
| 2 | Le refus de valider, et ce qui se passe alors | Montre que la main reste au client |
| 3 | Un champ du modèle de données qui n'existe dans aucun CRM du marché | Preuve la plus économique du sur mesure |
| 3 | Une relance qui arrive dans la messagerie, puis son enregistrement | Montre l'usage réel, pas l'écran |
| 4 | L'entonnoir, du volume d'entrée au petit nombre qui sort | Rend la qualification visible |
| 4 | Le contrôle de préflux qui bloque un envoi mal formé | La règle née de l'incident |

**Aucune capture ne montre un tableau de bord décoratif ni de fausses données.** Une capture qui contient une donnée client réelle exige un consentement écrit avant toute diffusion.

## Règles d'anonymisation

1. **Aucun nom de client dans le texte**, sans consentement écrit. Les cas se désignent par leur famille de problème.
2. **Aucun nom de personne**, ni de dossier, ni de raison sociale dans une capture. Floutage ou substitution par des données neutres.
3. **Aucun montant client**, ni dans une capture, ni dans un récit.
4. **Le secteur reste un décor, jamais une expertise revendiquée.** « Un grossiste » situe la contrainte métier ; « nous sommes experts du négoce alimentaire » est interdit tant qu'aucune signature hors réseau n'existe dans ce secteur.
5. **Un cas reste anonyme même anonymisé** s'il reste reconnaissable par recoupement. Le test : une personne du secteur peut elle nommer le client en lisant le cas.
6. **Le cas 2 relève du secret professionnel.** Aucune capture de correspondance, même floutée, sans accord écrit du cabinet.
7. **Le cas 4 parle de Parrit.ai**, donc sans contrainte d'anonymat, sauf pour les destinataires des envois.

## Conditions à réunir avant publication

Un cas ne se publie pas tant que les six conditions suivantes ne sont pas réunies.

1. **Le consentement écrit du client**, sur le texte exact et sur chaque capture. Le cas 4 en est dispensé.
2. **Le compteur posé et lu au moins une fois.** Sans cela, le cas se publie en décrivant la méthode et le problème, jamais un résultat.
3. **Chaque affirmation classée** `PROUVÉ`, `OBSERVÉ`, `À MESURER` ou `AMBITION`, avec sa source.
4. **Le passage à la relecture des interdits** de `00B` §8 et `07` §13 : aucun ROI, aucun délai systématique, aucun gain chiffré, aucun nom de concurrent, aucun tiret cadratin.
5. **Le socle de sécurité et de réversibilité écrit**, préalable spécifique aux cas 1 et 2, qui touchent à de la donnée comptable et à du secret professionnel.
6. **La lecture par une personne extérieure au dossier**, qui doit pouvoir réexpliquer ce que fait le système. C'est le test de vulgarisation ; s'il échoue, le cas n'est pas prêt.

## Ordre d'attaque recommandé

**Recommandation, pas une décision.** Le cas 2 en premier, parce que la modification requise est la plus petite, une colonne d'auteur, et parce qu'elle débloque la démonstration de l'autonomie, qui est la promesse la moins prouvée de tout le dossier. Le cas 1 ensuite, parce que la baseline est reconstituable sur des périodes passées sans attendre. Le cas 4 en parallèle, parce qu'il ne dépend d'aucune autorisation client. Le cas 3 en dernier, parce qu'il est bloqué par une reprise d'accès qui ne dépend pas de nous.

## Ce que ce plan ne résout pas

Il pose des compteurs, il ne produit pas de résultat. Un compteur peut très bien démontrer qu'un système n'a pas d'effet, et ce serait une information utile.

Il repose entièrement sur une personne, ce qui reproduit la dépendance que le cas 3 identifie comme un risque.

Et il ne dit rien du coût de revient, qui reste inconnu sur les quatre systèmes et qui conditionne la vente de toute exploitation.
