# AI Context

This repository is the public marketing site for Parrit.ai. It is a Next.js App Router application using Next.js 16, React 19, and Tailwind v4. The site is deployed to Vercel from `main`; the production Vercel project is configured for Node.js `24.x`, mirrored locally by `.nvmrc`.

Read `AGENTS.md` before changing code. It is the operating map for agents and includes the route inventory, the current risk areas, the release checks, and non-negotiable collaboration rules. Read `BRAND.md` before touching UI or copy. It is the visual and editorial source of truth.

## Architecture

The primary app lives under `src/app`. The localized public routes use the App Router segment `src/app/[lang]`, with `fr`, `en`, `pt-BR`, and `zh-CN` dictionaries. `zh-CN` is a fallback language path and should preserve the established fallback behavior instead of becoming an independent content surface unless that is explicitly planned.

The home page is `src/app/[lang]/page.tsx`, which renders `src/app/[lang]/HomeClient.tsx`. Most public marketing copy for the desktop-OS home lives in the `DICT` object inside `HomeClient.tsx`; styling and interaction behavior live in the presentation components and global CSS. Keep content changes in content structures and style changes in components or CSS.

Blog and actualite are data-driven. The common source shape is `BlogPostSource` in `src/lib/blog.ts`. Generated blog content is imported through `src/lib/blog-generated.ts`; actualite content is imported through `src/lib/actualite-generated.ts`. `actualite-generated.ts` has explicit sentinels, `ACTUALITE_GENERATED_START` and `ACTUALITE_GENERATED_END`; automated or bulk updates should append only inside those sentinels.

## Risk Areas

`src/app/[lang]/HomeClient.tsx` is intentionally large, around 3900 lines, and powers most of the public site. Re-grep the relevant sections before editing because line numbers drift. When changing home copy, keep the four language blocks structurally aligned.

Manual tables, especially in `src/lib/blog.ts`, are brittle. Do not run broad AST transforms over these files. Prefer narrow, sentinel-based changes for generated content and small hand edits for existing records.

Generated content and presentation logic are deliberately separated. Blog and actualite records carry content, metadata, and translations; components decide layout, styling, and interaction.

## Rules Before Push

Follow `BRAND.md` for palette, typography, visual components, and voice. Do not duplicate those rules here.

Never ship a runtime dependency on `*.vercel.app`. Vercel hosting itself is allowed; loading runtime assets, redirects, signatures, or other dependencies from `*.vercel.app` is not.

The public language set is `fr`, `en`, `pt-BR`, and `zh-CN` as fallback. Before pushing site changes, the target is `contrast-audit=0` and a successful `npm run build` across the four language paths. CI intentionally runs `npm run lint` before `npm run build`; if lint fails, report the failure and do not repair unrelated historical lint debt in the CI PR.

Public `NEXT_PUBLIC_*` values are build-time browser values in Next.js. In CI they must come from GitHub Secrets, never from committed literal values.
