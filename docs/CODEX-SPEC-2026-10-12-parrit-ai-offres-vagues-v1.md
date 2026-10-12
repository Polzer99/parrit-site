# Spec Codex : parrit.ai, retirer la tagline, « offert » et toute offre chiffrée (12/10/2026)

Décision de Paul (12/10/2026) : « On supprime la tagline aux pieds de page. On supprime le mot offert. Il faut rester vague. Il ne faut pas donner d'offres claires. » Choix confirmé : retirer les prix ET les contenus d'offre (durées, livrables, mécanique), ne garder qu'une invitation à prendre rendez-vous.

Aucune refonte visuelle : on retire, on ne redessine pas. FR et EN traités ensemble, à l'identique.

## 1. Tagline

- `src/system/components/RevFooter.tsx` : supprimer `principle` (FR « Une commande, pas un abonnement », EN « Commissioned, not subscribed ») et son rendu. Le pied de page garde ses liens et « Fondée par Paul Larmaraud ».
- `src/system/components/Opening.tsx` : retirer « Une commande, pas un abonnement. » de `statement` (et l'équivalent EN s'il existe).

## 2. Plus aucune offre chiffrée ni mécanique d'offre

Rien de ceci ne doit plus apparaître dans le rendu public (texte visible, meta, OG, JSON-LD, alt/aria), FR comme EN :
prix (3 500 €, « À partir de », « HT », « au forfait », « fixed price », « Sur devis », « Custom quote »), « offert », « Free », « gratuit », « sans engagement » / « no commitment », et les durées d'offre (« 15 min », « 15 minutes », « 30 min », « 10 heures », « 10 hours »).

- **Accueil `src/app/(rev01)/page.tsx`** : supprimer toute la section `offers` (les deux cartes) et l'import de `BUILD_WITH_YOU_PRICE`. Le titre de clôture devient FR « Un premier échange avec le fondateur vous dit si un système vaut d'être construit. » / EN « A first conversation with the founder tells you whether a system is worth building. ».
- **`src/app/(rev01)/systems/page.tsx`** : supprimer la carte d'offre et le calcul `price`. La FAQ « Par où commence-t-on ? » répond FR « Par un premier échange avec le fondateur. » / EN « With a first conversation with the founder. ».
- **`src/app/(rev01)/build-with-you/page.tsx`** : la page reste mais devient descriptive. Supprimer le bloc prix (`offer-price`, `basis`, import du prix). H1, metaTitle et metaDescription sans « 10 heures » : FR « Avec le fondateur, vous construisez un système qui tourne. » / EN « With the founder, you build a system that runs. » (la metaDescription garde sa suite « et vous repartez capable de construire le suivant… » sans durée). Étapes : « Examen », « Restitution », « Construction ensemble » sans aucune durée (FR « Un examen du besoin avec le fondateur. », « Les constats repris ensemble. », « La construction, avec le fondateur, d'un système qui tourne. » ; EN équivalents). `outTitle` FR « Ce qui en sort. » / EN « What comes out of it. ». `nextBody` sans « pendant les 10 heures » / « for 10 hours ». `examinationNote` : retirer « Examen offert · » / « Free examination · ».
- **`src/system/examination.ts`** : `EXAM_NOTE` FR « En visio, avec le fondateur », EN « Video call with the founder ».
- **`site.config.*`** : retirer `BUILD_WITH_YOU_PRICE` s'il n'a plus d'usage. Si `OfferCard`, `formatOfferPrice` et les styles `.offer-*` n'ont plus d'usage, les supprimer avec leurs tests unitaires (`tests/offer-card.test.mjs`) ; sinon les laisser.
- **Hors pages** : `src/lib/server/interets.ts` (l. ~244 et ~252) : « Un échange en visio avec le fondateur la précise : » / « A video call with the founder sharpens it: ». `src/lib/registry/cta.ts` : libellés « Réserver un échange avec Paul », « Réserver un échange sur ce sujet », « Réserver un échange ». `src/lib/server/leads.ts:328` : « proposer un échange ». `public/llms.txt` : retirer « 15-minute », « 15 min » et tout prix ; décrire la réservation comme « a video call with the founder ».
- Ne pas toucher : le capital social dans `legal/page.tsx` (100 €), la synchronisation « toutes les 15 minutes » dans `MechanismSchema.tsx` (fait technique, pas une offre).

## 3. Tests

- Mettre à jour les tests qui exigent prix, cartes ou durées (`tests/offer-cards.spec.ts`, `tests/systems.spec.ts` l. ~43-45, `tests/conformity-home.spec.ts`, `tests/doctrine-visible.spec.ts`, `tests/brand-os*.`, etc.) : ils doivent désormais exiger l'ABSENCE de prix et d'offre. Supprimer `tests/offer-cards.spec.ts` s'il n'a plus d'objet et le retirer de `qa:network:rev01`.
- Étendre `tests/anti-slop-copy.spec.ts` (toutes les routes, FR et EN) : le texte du body ne contient ni `€` (sauf /legal), ni `/offert|gratuit|\bfree\b|forfait|fixed price|sur devis|custom quote|sans engagement|no commitment|pas un abonnement|not subscribed|\b1[05]\s?(min|minutes|heures|hours)\b|\b30\s?min/i`. Même contrôle sur `public/llms.txt` dans `tests/anti-slop-copy.test.mjs`.
- Batterie verte attendue : `npm run build`, `npm test`, `QA_BASE_URL=http://localhost:3210 npm run qa:network:rev01`.

Ne pas commit, ne pas pousser : Claude relit, commit et ouvre la PR.

## 4. Sources de vérité à mettre à jour dans le même geste

- `TRUTH.md` l. 11 : retirer « Une commande, pas un abonnement. ». L. 57 (règle **Prix**) : remplacer par « **Prix et offres** : décision directe de Paul du 12/10/2026 : le site public n'affiche AUCUN prix, AUCUNE offre détaillée (durées, livrables, forfait, « offert », « sur devis »). Il reste vague et invite à un premier échange avec le fondateur ; périmètre et prix se donnent en rendez-vous puis en propale privée. Remplace la décision du 08/10/2026 (ancrage 3 500 € HT). »
- `AGENTS.md`, section « Règles de sortie » : remplacer la phrase « Prix publics autorisés uniquement sous forme d'ancrage… » par « Aucun prix ni offre détaillée sur le site public (décision Paul 12/10/2026, voir TRUTH.md). »
- `AI_CONTEXT.md` : une ligne qui consigne la décision et la gate anti-offre.
