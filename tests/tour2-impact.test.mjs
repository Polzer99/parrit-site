import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderPage } from './helpers/site-v1-render.mjs';
import { visibleText } from '../scripts/brand-os-contracts.mjs';

const doors = ['consulting-transformation', 'ai-sprints', 'engineering-integration', 'harness-engineering'];
for (const locale of ['fr', 'en']) {
  test(`tour 2 shared visual content survives SSR ${locale}`, async () => {
    const home = await renderPage(locale);
    for (const id of doors) {
      assert.ok(home.includes(`data-service-visual="${id}"`));
      const guide = await renderPage(locale, id);
      assert.ok(guide.includes(`data-service-visual="${id}"`));
      assert.equal((guide.match(/<h1\b/g) ?? []).length, 1);
      assert.doesNotMatch(guide, /style="[^"]*(?:display:none|visibility:hidden|opacity:0)/);
    }
    assert.doesNotMatch(home, /v1-switcher|role="tab"/);
    const star = home.match(/<ol class="v1-harness-diagram"[\s\S]*?<\/ol>/)[0];
    assert.equal((star.match(/<li /g) ?? []).length, 8);
    assert.equal((home.match(/marker-end="url\(#harness-head-/g) ?? []).length, 8);
    const sprint = home.match(/class="v1-sprint-diagram"[\s\S]*?<\/ul>/)[0];
    assert.equal((sprint.match(/<li>/g) ?? []).length, 7);
    assert.equal((sprint.match(/<svg /g) ?? []).length, 6);
    const hero = home.match(/<section[^>]*id="H01"[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(hero, /<h2/);
    assert.equal((hero.match(/class="rev-button exec"/g) ?? []).length, 1);
    assert.ok(hero.includes(locale === 'fr' ? 'Démonstration, données fictives.' : 'Demonstration in French, fictional data.'));
  });
  test(`tour 2 guide duplicates removed and French apostrophes ${locale}`, async () => {
    const engineering = visibleText(await renderPage(locale, 'engineering-integration'));
    assert.equal((engineering.match(locale === 'fr' ? /Vos outils actuels restent en place/g : /Your current tools stay in place/g) ?? []).length, 1);
    assert.equal((engineering.match(locale === 'fr' ? /La cession des droits/g : /The assignment of rights/g) ?? []).length, 1);
    const sprint = visibleText(await renderPage(locale, 'ai-sprints'));
    assert.equal((sprint.match(locale === 'fr' ? /Avec vos utilisateurs, contre les critères du cadrage/g : /With your users, against the scoping criteria/g) ?? []).length, 1);
    if (locale === 'fr') for (const id of ['home', ...doors]) assert.doesNotMatch(visibleText(await renderPage(locale, id)), /[\p{L}]'[\p{L}]/u);
  });
}
test('tour 2 animation is opt-in and uses canonical timing', () => {
  const css = readFileSync('src/system/site-v1.css', 'utf8');
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*\.v1-service-visual[^}]*animation: v1-visual-reveal var\(--hold\) var\(--ease\)/);
  assert.match(css, /from \{ clip-path: inset\(100% 0 0 0\); \} to \{ clip-path: inset\(0\); \}/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*animation: none !important/);
});
