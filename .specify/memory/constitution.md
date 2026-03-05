<!--
SYNC IMPACT REPORT
==================
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: N/A (initial document)
Added sections:
  - Core Principles (I–VI)
  - Stack & Technology Constraints
  - Development Workflow & Code Style
  - Governance
Templates reviewed:
  - .specify/templates/plan-template.md         ✅ aligned
  - .specify/templates/spec-template.md         ✅ aligned
  - .specify/templates/tasks-template.md        ✅ aligned
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): confirm exact date if different from 2026-03-05
  - Prisma schema to be defined in /speckit.plan phase (data-model.md)
-->

# Alice Blog Constitution

## Core Principles

### I. Server-First Architecture (NON-NEGOTIABLE)

Every page and data-fetching concern MUST default to the server.
Client Components are permitted ONLY when browser APIs, event handlers, or
React 19 hooks (`useActionState`, `useOptimistic`) are strictly required.

- All routes in `src/app/` MUST be Server Components by default.
- Data reads MUST be implemented inside `src/data-access/` with the `"use cache"` directive.
- Mutations MUST be implemented as Server Actions inside `src/actions/`.
- Direct database calls from Client Components or API Routes are FORBIDDEN.
- The DAL (`src/data-access/`) is the ONLY layer permitted to import Prisma.

### II. Type Safety & Validation (NON-NEGOTIABLE)

Every external boundary — Server Actions, route params, search params,
environment variables — MUST be validated with a Zod schema before use.

- TypeScript strict mode MUST be enabled (`"strict": true`).
- The `any` type is FORBIDDEN; use `unknown` and narrow explicitly.
- All Zod schemas MUST live in `src/lib/schemas/` and be named
  `<entity>.schema.ts`.
- Server Actions MUST call `schema.safeParse()` and return a typed
  `ActionResult<T>` union before executing any business logic.
- Prisma-generated types MUST be re-exported from `src/lib/prisma.ts` and
  used as the canonical entity types across the codebase.

### III. Component Architecture & Naming Conventions

Components are the public face of the application and MUST follow a
consistent structure that separates concerns and enables reuse.

- `src/components/ui/` — atomic, stateless, design-system primitives
  (Button, Badge, Avatar). MUST have no business logic.
- `src/components/blog/` — feature organisms (CommentSection, PostCard,
  LikeButton). May hold local state or Client-side hooks.
- Component files MUST use `export function ComponentName()` (named export,
  PascalCase).
- Non-component utilities (helpers, formatters, hooks) MUST use arrow
  functions and named exports: `export const fn = () => {}`.
- File names MUST be kebab-case matching the exported symbol
  (e.g., `comment-section.tsx` → `export function CommentSection`).
- One top-level export per file (co-located types/helpers permitted).

### IV. Caching & Performance

The application MUST be fast by default. Performance is not an
afterthought — it is a gate for every feature.

- Every DAL function that reads data MUST use the `"use cache"` directive
  (Next.js 16 Partial Prerendering model).
- Cache tags MUST follow the convention `<entity>:<id>` (e.g., `post:slug`,
  `comments:postId`) and be registered via `cacheTag()`.
- Cache invalidation MUST use `revalidateTag()` inside the relevant Server
  Action immediately after a successful mutation.
- Optimistic UI for Likes and Comments MUST use React 19 `useOptimistic`
  to avoid round-trip latency on interactions.
- Images MUST use `next/image` with explicit `width`/`height` or `fill`.
- Web Fonts MUST be loaded via `next/font` — no external font requests.

### V. Design System & Visual Consistency

The visual language is non-negotiable and MUST be enforced at the
CSS-variable level, not scattered inline or in component props.

Brand token palette (defined once in `src/app/globals.css`):

```
--brand-brown:   #5D4037
--brand-green:   #1B3022
--cloud-dancer:  #F0EEE9
--black:         #000000
```

- Tailwind CSS v4 MUST be configured exclusively via CSS `@theme` block
  in `globals.css`; no `tailwind.config.*` file for tokens.
- Utility classes MUST reference the brand tokens
  (e.g., `bg-brand-brown`, `text-cloud-dancer`).
- Typography MUST prioritise legibility: minimum 16px body, generous
  line-height (≥1.7), max prose width of 65ch.
- Visual style target: Substack / Medium — minimal chrome, focus on
  content, no decorative noise.
- Dark mode support is DEFERRED to a future amendment.

### VI. Database & Data Model Integrity

The Prisma schema is the single source of truth for all data shapes.
No ad-hoc query logic outside the DAL is permitted.

Core entities (canonical model — detailed schema in `data-model.md`):

- **User** — admin/author identity; fields: `id`, `name`, `email`,
  `image`, `role` (enum: ADMIN | READER), `createdAt`.
- **Post** — published article; fields: `id`, `slug` (unique), `title`,
  `excerpt`, `content` (MDX/raw), `coverImage`, `publishedAt`,
  `authorId`, `tags` (String[]), `status` (enum: DRAFT | PUBLISHED).
- **Comment** — threaded comment; fields: `id`, `body`, `authorName`,
  `authorEmail`, `postId`, `parentId` (nullable, self-relation for
  replies), `createdAt`, `approved` (Boolean).
- **Like** — idempotent reaction; fields: `id`, `postId`,
  `fingerprint` (anonymous identifier), `createdAt`.
  Unique constraint: `@@unique([postId, fingerprint])`.

Additional recommended entities (evaluate in `/speckit.plan`):
- **Tag** — normalised taxonomy for posts (`id`, `name`, `slug`).
- **NewsletterSubscriber** — email capture (`id`, `email`, `confirmedAt`).
- **ReadingProgress** — tracks scroll depth per visitor (analytics).
- **View** — simple page-view counter per post (analytics, no auth needed).

All migrations MUST be committed alongside the code change that requires them.
Prisma `@@map` MUST be used to keep table names in `snake_case`.

---

## Stack & Technology Constraints

| Concern        | Decision                                        |
|----------------|-------------------------------------------------|
| Framework      | Next.js 16 — App Router, RSC, Server Actions   |
| UI Library     | React 19 — `useActionState`, `useOptimistic`   |
| Styling        | Tailwind CSS v4 — CSS-variable tokens only      |
| Validation     | Zod — all external inputs, strict schemas       |
| ORM            | Prisma — sole DB access, via DAL only           |
| Database       | PostgreSQL (recommended) or SQLite for dev      |
| Package Mgr    | pnpm                                            |
| Language       | TypeScript 5 — strict mode, no `any`           |
| React Compiler | Enabled (`reactCompiler: true` in next.config)  |

**Prohibited patterns**:
- `pages/` directory (App Router only).
- `getServerSideProps` / `getStaticProps` (legacy API).
- Direct `fetch()` in Client Components for data that belongs in DAL.
- `useEffect` for data loading (use Server Components or SWR if needed).

---

## Development Workflow & Code Style

### Code Style Rules

- Comments MUST explain *why*, never *what* the code does.
- No commented-out code in committed files.
- Imports MUST be ordered: external → internal (`@/`) → relative.
- Server Actions MUST be prefixed with a verb: `createComment`,
  `toggleLike`, `deletePost`.
- DAL functions MUST be prefixed with `get` or `query`:
  `getPostBySlug`, `getRecentPosts`.

### Git Workflow

- Branch names follow the SpecKit convention: `###-short-description`.
- Commit messages follow Conventional Commits:
  `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.
- PRs MUST reference the spec and pass the constitution checklist.

### Quality Gates (every PR)

1. `pnpm typecheck` — zero type errors.
2. `pnpm lint` — zero ESLint warnings.
3. `pnpm build` — production build succeeds.
4. Manual smoke test of affected routes in preview deployment.

---

## Governance

This constitution supersedes all other practices, conventions, and
preferences. Any pattern that conflicts with a principle above is invalid
regardless of precedent.

**Amendment procedure**:
1. Open a PR with the proposed change to `constitution.md`.
2. Bump version following semantic rules (see below).
3. Update the Sync Impact Report comment at the top of the file.
4. Propagate changes to all affected templates and docs.
5. Obtain explicit approval before merging.

**Versioning policy**:
- MAJOR — removal or redefinition of a Core Principle.
- MINOR — new principle, section, or material guidance expansion.
- PATCH — clarifications, wording, typo corrections.

**Compliance review**: every `/speckit.plan` execution MUST include a
"Constitution Check" gate that cross-references all active principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-05 | **Last Amended**: 2026-03-05
