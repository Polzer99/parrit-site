# 02F · Base de vérité

01/08/2026. Base commune de toutes les décisions qui suivent. Arrêtée après l'audit des sources primaires (`02D`).

**Périmètre de l'audit qui fonde ce document** : 25 threads Gmail ouverts · 10 PDF ouverts · 6 documents contractuels localisés, **aucun signé** · 106 workflows listés sur l'instance live dont 35 actifs, 3 JSON inspectés en détail · **55 transcripts lus intégralement** · échantillon neutre de 60 (`setseed(0.42)`), 41 lus, 19 restants nommés.

---

## 1. Faits suffisamment soutenus

Chacun vient d'une source primaire ouverte.

1. **Une seule facture d'un client actif a été ouverte et lue** : F-2026-034, NOO CORP / Joone, « Kick-off IA + ateliers référents (12 h) », 2 160 € HT / 2 592 € TTC, émise le 12/06.
2. **`revenue_events` contient 2 lignes, `clients` en contient 1.** La ligne Gazelec porte `invoice_id` NULL et la note « facture encaissée d'après Paul ».
3. **Aucun contrat signé n'existe.** Six documents contractuels localisés : deux templates vierges identiques, un apport d'affaires à lignes de signature vides, un NDA sans paraphe, une convention de formation marquée « Brouillon », deux accords de confidentialité dont la signature n'est pas vérifiable.
4. **Les CGV Parrit.ai v1.0 (janvier 2025) existent** : Parrit.ai coordinateur, obligation de moyens, sous-traitants seuls responsables techniquement, responsabilité plafonnée au montant HT perçu. Jamais opposées à personne.
5. **Un client a demandé de lui-même un accompagnement vers l'autonomie.** Diego Borreguero, Trainline, 27/07 : « work with you as a consultant to train me or someone on the GTM team ».
6. **Une offre d'autonomie chiffrée existe, écrite** : packs de 10 h, 2 500 € le pack, un à trois mois, résiliable chaque mois, test d'autonomie final, « If it does not pass, I keep going at no extra cost ». Réponse du client le 29/07 : « this is exactly what I needed ».
7. **Deux modèles de prix autres que le forfait ont été proposés** : au résultat (devis EFI, setup 3 000 € + 50 € HT par RDV qualifié) et récurrent (devis Hertman, 2 900 € + 600 €/mois sur 12 mois). Ni l'un ni l'autre n'a produit d'encaissement traçable.
8. **Le comité ne signe pas.** Trainline, IUC (DSI puis COMEX), Moët Hennessy, IPD : quatre dossiers, zéro euro.
9. **Les systèmes livrés tournent, mais leur usage client n'est mesuré nulle part.** Sur sept systèmes examinés : 4 workflows actifs, 2 usages clients constatés, **0 résultat mesuré**, **0 coût connu**.
10. **`efi_forwarded_replies` est figée depuis le 05/06** alors que le cron tourne toutes les heures, et deux implémentations concurrentes (n8n et GitHub Actions) écrivent dans la même table.
11. **Le principal actif technique client a été construit gratuitement par quelqu'un qui part.** Mail du 27/07 : « il est désormais impossible pour moi de continuer à travailler gratuitement pour toi ». Dernier commit du CRM Laparra : 23/07, par elle.
12. **Le parcours Lime est corroboré par une source indépendante du CV** : dans une réunion du 16/03, Paul cite son expérience en gestion de produit chez Lime à un tiers.

---

## 2. Conclusions corrigées par l'audit

### Corpus
**Ancienne conclusion** : 1 754 transcripts métier auraient été analysés.
**Corrigée** : la base contient **65,1 % de notifications téléphoniques automatiques** (1 141 lignes) et **environ 215 réunions réellement transcrites**. Les rattachements sont peu fiables : `client_id` est NULL sur 100 % des lignes, deux `prospect_id` sont prouvés faux, et le champ `source` est corrompu (60 valeurs au lieu de 6). Les trois entités les plus représentées sont internes : Serge Lebrun 65, Maxime Boué 54, Yukun Leng 41.

### Hertman
**Ancienne conclusion** : la démonstration a produit de l'enthousiasme sans besoin ni achat.
**Corrigée** : le devis a été envoyé le 05/05, le prospect a répondu positivement le 06/05 (« je reviens vers toi rapidement »), puis **aucune relance pendant trois mois**. La fiche affiche « généré jamais envoyé », ce que Gmail dément. Le dossier démontre un **défaut de suivi commercial**, pas une absence de besoin. Le « 900 €/mois » venait d'une V1 de devis rangée.

### Autonomie
**Ancienne conclusion** : l'autonomie est une ambition jamais demandée.
**Corrigée** : Trainline l'a **explicitement demandée**, et une offre mensuelle résiliable avec test d'autonomie a reçu « this is exactly what I needed ». **La demande est observée. Le résultat ne l'est pas** : rien n'a été signé, rien n'a été livré sous ce format.

### Clevery
**Ancienne conclusion** : le transfert de la décision au client serait prouvé.
**Corrigée** : `clevery_relance_events` est **silencieuse depuis le 29/06** (dernier événement 06/07), la table **n'a aucune colonne d'auteur**, et le workflow n8n associé est **inactif depuis le 11/04**. Le bot Python tourne sur un VPS non inspecté. **Le transfert reste non démontré.**

### Réalité commerciale
**Ancienne conclusion** : sept ventes seraient solidement documentées.
**Corrigée** : **six sur sept ne sont pas réconciliées de bout en bout** entre facture, encaissement, livraison et usage. Aucune facture n'existe pour EFI, Laparra, Didier, June et IPD. Deux dossiers cités partout (June 2 500 €, IPD 13 000 €) n'ont aucune trace ni dans Gmail, ni sur le disque, ni en base.

---

## 3. Ce que les sources historiques ne peuvent pas décider

Aucune quantité de recherche supplémentaire ne tranchera ces points. Ils relèvent d'un choix ou d'un test.

- **Le positionnement futur voulu par Paul.** L'histoire dit ce qui a été vendu, pas ce qu'il veut vendre.
- **Le bon secteur.** Un seul cabinet, familial ; un seul industriel ; zéro e-commerce signé sur huit propales.
- **Le bon produit d'entrée.** Trois formats ont produit du revenu, aucun n'a été répété assez pour départager.
- **La volonté de payer pour un RUN.** Jamais facturé une seule fois.
- **Le prix cible de 5 000 € par mois.** Jamais proposé à personne.
- **La pertinence commerciale de la super app.** Aucun client ne l'a vue.
- **La possibilité de rendre la production indépendante de Paul.** Bloquée par une limite de licence n8n et un départ, pas par une donnée historique.

---

## 4. Vision actuelle déclarée par Paul

**Ceci est une vision, pas une preuve.** Aucun élément de cette section n'est établi par les sources ; ils sont consignés tels que Paul les formule, pour être validés ou corrigés par lui.

- Parrit.ai reste **global et transsectoriel**.
- Parrit.ai intervient **temporairement** dans l'entreprise.
- Parrit.ai **comprend le problème, construit, met en fonctionnement et itère**.
- Le client peut **choisir entre RUN et reprise progressive**.
- L'objectif est de produire un **impact opérationnel important**.
- À terme, les dirigeants **supervisent leurs systèmes depuis une interface unique**.
- Parrit.ai doit **progressivement devenir moins nécessaire**.

*Note de cohérence, sans arbitrage : le dernier point et le RUN payant tirent dans des directions opposées. C'est la décision 12 du Validation Pack, elle reste ouverte.*

---

## 5. Promesses temporairement interdites

Interdites d'usage public tant qu'une preuve n'est pas produite. La liste est suspensive, pas définitive.

| Promesse | Ce qui manque |
|---|---|
| Un ROI client | Aucun gain n'est mesuré chez aucun client |
| L'autonomie déjà obtenue | Zéro client autonome ; la seule boucle transférée est muette depuis le 29/06 |
| Un délai systématique de sept jours | Jamais compté. « 3 à 5 semaines » est un chiffre-totem répété sans être recalculé |
| Un modèle récurrent validé | 0 € de récurrent confirmé en banque |
| Vingt experts contractualisés et mobilisables | Aucun contrat de partenaire ; le réseau appartenait à quelqu'un qui part le 31/08 |
| Une spécialisation sectorielle prouvée | Une référence par secteur au mieux, dont la principale est familiale |
| La super app déjà vendue | Aucun client ne l'a vue |
| Une livraison indépendante de Paul | Bloquée par une limite de licence n8n et par le départ du 31/08 |
| Des systèmes auto-apprenants démontrés | Zéro brique conforme à la règle §45 qui l'exige |

**Trois faits factuels qui doivent aussi disparaître de la copy** : le nom « Gazelec Moins Cher » (le client est EFI Énergies), le nom « Hertman » (l'interlocuteur est Guillaume Hert, Amplify Groupe), et « 1 747 transcripts » comme preuve de matière.
