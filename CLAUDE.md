# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Alice-Blog: a Portuguese-language (pt-BR) personal blog built with Next.js 16 (App Router, React 19), Prisma 7 + PostgreSQL, Tailwind CSS v4. User-facing strings, error messages and most code comments are in Portuguese — keep them that way.

## Commands

Package manager is **pnpm**.

```bash
docker compose up -d postgres   # Local Postgres 16 on host port 5433 (db alice_blog_dev, user alice)
pnpm dev                        # Dev server at http://localhost:3000
pnpm typecheck                  # tsc --noEmit (fastest check)
pnpm lint                       # ESLint (flat config, eslint-config-next)
pnpm build                      # prisma generate + next build — reproduces CI/Vercel failures locally
pnpm format                     # Prettier over src/
pnpm db:migrate                 # prisma migrate dev
pnpm db:seed                    # tsx prisma/seed.ts (needs SEED_* env vars)
pnpm db:studio | pnpm db:reset
```

There is no test suite. Quality gates per PR (from the constitution): `pnpm typecheck`, `pnpm lint`, `pnpm build` all clean.

Env vars (see `.env.example`): `DATABASE_URL`, `SESSION_SECRET` (≥16 chars, required — `getSession()` throws without it), `SEED_*` for seeding, optional `NEXT_PUBLIC_CONTACT_EMAIL`.

## Architecture

**Generated Prisma client.** The client is generated to `src/generated/prisma/` (gitignored) and imported as `@/generated/prisma/client`. If you see `Can't resolve '@/generated/prisma/client'`, run `prisma generate` (also runs on `postinstall` and `build`). `src/lib/prisma.ts` is the singleton client (uses `@prisma/adapter-pg`) and re-exports entity types (`Post`, `User`, `Comment`, `Like`) — import types from `@/lib/prisma`, not from the generated folder. Prisma config (datasource URL, seed) lives in `prisma.config.ts`, not in `schema.prisma`. Tables/columns are `snake_case` via `@@map`/`@map`; commit migrations with the change that needs them.

**Cache Components are on** (`cacheComponents: true`, `reactCompiler: true` in `next.config.ts`). Consequences:
- Reads live in `src/data-access/` and use `'use cache'` + `cacheTag(...)`. Tag convention: `post:<slug>`, `posts:list`, `comments:<postId>`, `likes:<postId>`.
- Mutations are Server Actions in `src/actions/` and must call `revalidateTag(tag, 'max')` for every affected tag after a successful write.
- Anything dynamic (`await params`, `cookies()`/`getSession()`, DB access) must happen inside a `<Suspense>` boundary. Pages follow a pattern of a sync page component wrapping an async `*Loader` component in Suspense (see `src/app/blog/[slug]/page.tsx`, `src/app/admin/layout.tsx`). Fallbacks use `LoadingDots`.
- `/blog/[slug]` intentionally has **no** `generateStaticParams` (an empty list breaks the build when the DB is unreachable). Don't add one unless the build has DB access and returns at least one slug.

**Server Action contract.** Actions return `ActionResult<T>` (`src/lib/types.ts`), a `{ success: true, data } | { success: false, error, fieldErrors? }` union, typically with the `(prev, formData)` signature for `useActionState`. Validate every input with a Zod schema from `src/lib/schemas/<entity>.schema.ts` via `safeParse` before any logic. Route/search params are also Zod-validated. Note: in practice actions import `prisma` directly for writes; the DAL holds the cached reads.

**Auth** is hand-rolled in `src/lib/auth.ts`: HMAC-SHA256-signed cookie `alice_session` (7 days) carrying `{ userId, name, email, role }`. Passwords use bcryptjs. Roles are `ADMIN | READER`; admin checks are `session.role === 'ADMIN'` in actions and the `AdminAuthGuard` in `src/app/admin/layout.tsx`. Likes use `session.userId` as the `fingerprint` (unique per `postId, fingerprint`).

**Content rendering.** Posts and comments are Markdown with raw HTML allowed (`react-markdown` + `remark-breaks` + `rehype-raw`). Comments are threaded one level deep (`parentId` self-relation); editing is allowed for 5 minutes.

**Reader preferences** (theme mode, hidden navbar links, reading font size/width/line height) live in `localStorage` (`alice-prefs`), not the DB. `src/lib/preferences.ts` holds the types, `NAV_ITEMS` (single source for navbar links) and `applyPreferences`, which sets `--read-*` CSS vars on `<html>` and injects a `<style>` hiding `[data-nav-key]` links. `applyPreferences` is serialized via `toString()` into `PREFERENCES_INIT_SCRIPT`, rendered in `layout.tsx` right after the next-themes script so prefs apply before first paint, so keep it self-contained (no imports or outer references). The "auto" theme mode (dark 18h–6h) is not a next-themes theme: the init script and `AutoThemeScheduler` (`theme-provider.tsx`) resolve it to `light`/`dark`. Change themes (and reset preferences) through `useThemeMode`, not `setTheme`, so the saved mode stays in sync. Allowed values, labels and CSS values for each reading option come from the `*_OPTIONS` arrays; add new options there only. The panel is `PreferencesProvider`/`usePreferencesDialog` (`src/components/preferences/`); server components open it with `OpenPreferencesButton`.

**Styling.** Tailwind v4 configured only through the `@theme` block in `src/app/globals.css` (no `tailwind.config`). Use the brand tokens (`brand-brown`, `brand-green`, `cloud-dancer`, …) rather than raw colors. shadcn-style primitives in `src/components/ui/` (`cn` in `src/lib/utils.ts`); light/dark via `next-themes`. Fonts via `next/font`, images via `next/image`.

## Conventions

From `.specify/memory/constitution.md` and `.cursor/rules/`:

- Server Components by default; `'use client'` only when browser APIs, event handlers, or hooks like `useActionState`/`useOptimistic` are needed. No `useEffect` for data fetching.
- Components: `export function ComponentName()` (named, PascalCase). Utilities/hooks: `export const fn = () => {}`. File names kebab-case matching the export.
- Server Actions are verb-prefixed (`createComment`, `toggleLike`); DAL functions `get`/`query`-prefixed.
- No `any` — use `unknown` and narrow.
- Imports ordered: external → `@/` internal → relative. Path alias `@/*` → `src/*`.
- Icons: always `lucide-react` (named import, `size` prop, `aria-hidden` when decorative); never inline SVGs or other icon libs.
- Prettier: single quotes, semicolons, `printWidth: 100`, trailing commas `es5`.
- Comments explain *why*, not *what*. Conventional Commits (`feat:`, `fix:`, …).

## Specs workflow (SpecKit)

Features are specified in `specs/NNN-name/` (`spec.md`, `plan.md`, `tasks.md`, `data-model.md`, `contracts/`) and driven by `/speckit.*` commands (definitions in `.cursor/commands/`, listed in `spec-commands.md`). Branch names follow `NNN-short-description`. Check the relevant spec before changing a feature; `003-blog-redesign` is in progress and `004` (accessibility/reading settings) is planned.
