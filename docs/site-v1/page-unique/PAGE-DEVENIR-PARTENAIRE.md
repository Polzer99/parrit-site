# Page « Devenir partenaire » (Paul, 27/10/2026)

Décision de Paul, posée dans la session du chantier site le 27/10 : « Page + lien dans #partenaires ».
Objectif : une URL à faire circuler pour recruter des **formateurs et consultants IA** (aucun autre
type de partenaire) vers le formulaire du réseau. Source du texte : le formulaire lui-même,
`~/parrit-os/projects/reseau-formateurs-ia/docs/FORMULAIRE.md` (introduction, aide RGPD, mention
Qualiopi). Aucun engagement nouveau.

Formulaire (public, en français) :
`https://docs.google.com/forms/d/e/1FAIpQLSeNVPnXs_ji3QJSC8WHGs6UPtOgO1GPdTfs6jc6T1S5cpB9aw/viewform`

## 1. Routes

- `/fr/devenir-partenaire` (FR) et `/become-a-partner` (EN), alternates `hreflang` croisés, dans le
  sitemap, la bascule de langue de l'en-tête mène de l'une à l'autre.
- Métadonnées : titre « Devenir partenaire · Parrit.ai » / « Become a partner · Parrit.ai », description
  = la phrase d'accroche ci-dessous, image de partage existante.
- Même en-tête et même pied que l'accueil. `public-routes.ts` mis à jour pour que toutes les specs
  existantes (anti-slop, aération, lisibilité, contraste, liens internes, réseau) couvrent la page.

## 2. Contenu

Structure : H1 (avec la seconde partie en gras, comme l'accueil), une phrase d'accroche, trois blocs
courts côte à côte sur ordinateur (empilés sur téléphone), le bouton, une note. La page tient dans un
écran à 1440×800 et 1280×720 (règle « un bloc = un écran » de la passe 4).

| Élément | FR | EN |
|---|---|---|
| H1 | Formateurs et consultants IA, **rejoignez notre réseau.** | AI trainers and consultants, **join our network.** |
| Accroche | Parrit.ai répond à des demandes de formation et à des appels d'offres sur l'intelligence artificielle. Nous cherchons des formateurs qui pratiquent ce qu'ils enseignent et qui rendent leurs stagiaires autonomes. | Parrit.ai answers training requests and calls for tenders on artificial intelligence. We are looking for trainers who practise what they teach and leave their trainees able to work on their own. |
| Bloc 1, titre | Ce que nous cherchons | What we look for |
| Bloc 1, texte | Une pratique réelle de l'IA, et des participants qui savent faire seuls à la fin de la formation. Trois compétences maîtrisées valent mieux que douze cochées. | Real, hands-on practice of AI, and participants who can work on their own by the end of the course. Three skills you master beat twelve boxes ticked. |
| Bloc 2, titre | Comment s'inscrire | How to sign up |
| Bloc 2, texte | Un formulaire de 7 à 10 minutes, sans compte. La certification Qualiopi n'est pas exigée. Ce que vous déclarez est revu avec vous avant toute mission. | A 7 to 10 minute form, no account needed. Qualiopi certification is not required. What you declare is reviewed with you before any assignment. |
| Bloc 3, titre | Vos informations | Your information |
| Bloc 3, texte | Elles restent internes à Parrit.ai. Aucune fiche n'est transmise à un client sans votre accord. L'inscription ne garantit pas de mission. | It stays within Parrit.ai. No profile is shared with a client without your consent. Signing up does not guarantee an assignment. |
| Bouton (`exec`, rose) | Rejoindre le réseau | Join the network |
| Sous le bouton (EN seulement) | — | The form is in French. |
| Note | Responsable du traitement : Paul Larmaraud (Parrit.ai). Pour consulter, corriger ou supprimer vos informations : paul.larmaraud@parrit.ai. | Data controller: Paul Larmaraud (Parrit.ai). To access, correct or delete your information: paul.larmaraud@parrit.ai. |

- Le bouton est un lien vers le formulaire : `target="_blank"`, `rel="noopener noreferrer"`, sans
  paramètre ajouté. C'est la seule action rose de la page (règle « un seul éclat rose par écran »).
- L'adresse e-mail est un lien `mailto:`.
- Aucun prix, aucun nom de client, aucun nom de formateur, aucune mention de la SNCF.

## 3. Lien depuis l'accueil

Dans `#partenaires`, sous la légende de l'équipe, une ligne : « Vous êtes formateur ou consultant IA ? »
suivie d'un bouton `ghost` « Rejoindre le réseau » / « Are you an AI trainer or consultant? » +
« Join the network », vers la page de la langue courante (pas directement vers le formulaire). Il ne
doit ni casser la règle « un bloc = un écran » de `#partenaires` aux trois tailles, ni ajouter de rose.

## 4. Tests

- La page répond 200 dans les deux langues, `hreflang` croisés, présente au sitemap.
- Le bouton pointe exactement vers l'URL du formulaire ci-dessus, avec `target` et `rel` attendus.
- Le lien de `#partenaires` mène à la page de la même langue.
- Les specs existantes passent sur la nouvelle route (via `public-routes.ts`), sans assouplissement.
- Aucune requête réseau sortante dans les tests (le lien externe n'est jamais chargé).

## 5. Batterie

`npm ci && npm run lint && npm run build && npm test && npm run qa:brand:rev01 && npm run qa:claims:rev01 && npm run test:brand-os` ;
navigateur rejoué par Claude sur l'hôte.
