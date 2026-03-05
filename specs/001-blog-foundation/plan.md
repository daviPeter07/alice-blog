# Implementation Plan: Blog Foundation — Estrutura Base

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-blog-foundation/spec.md`

---

## Summary

Implementar a infraestrutura fundacional do Alice Blog: configuração do projeto,
schema Prisma com as entidades canônicas (User, Post, Comment, Like), DAL com
caching via `"use cache"`, Server Actions validadas com Zod, componentes base
e uma página de post funcional que integra todos os elementos (US1, US2, US3).

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma 6, Zod 3
**Storage**: PostgreSQL 16 (Docker local) — `DATABASE_URL` via `.env`
**Testing**: Smoke tests manuais (ver quickstart.md) — testes automatizados deferred
**Target Platform**: Web — Next.js / Vercel
**Project Type**: Web application (full-stack, App Router)
**Performance Goals**: TTFB < 200ms para posts cacheados; optimistic UI < 50ms
**Constraints**: TypeScript strict, sem `any`, sem `useEffect` para data fetching
**Scale/Scope**: MVP para 1 blog com seed manual; ~10 arquivos novos/modificados

---

## Constitution Check

*GATE: Deve passar antes de iniciar a implementação.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Server-First | Todas as rotas são Server Components; DAL é a única camada com Prisma | ✅ |
| II. Type Safety | Zod em toda Server Action; `strict: true`; sem `any` | ✅ |
| III. Component Architecture | `ui/` (atoms) vs `blog/` (organisms); `export function` para componentes; arrow fn para utils | ✅ |
| IV. Caching & Performance | `"use cache"` em toda função DAL; `cacheTag` + `revalidateTag`; `useOptimistic` para likes/comments | ✅ |
| V. Design System | Tokens no `@theme` do `globals.css`; `next/font` para fontes; sem hex hardcoded | ✅ |
| VI. Database Integrity | Prisma como fonte única; `@@map` snake_case; migrations commitadas | ✅ |

**Resultado**: ✅ Sem violações — pode prosseguir para implementação.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-foundation/
├── plan.md              ← Este arquivo
├── research.md          ← Decisões técnicas (fingerprint, cache, fontes)
├── data-model.md        ← Schema Prisma + Zod schemas
├── quickstart.md        ← Como rodar do zero
├── contracts/
│   ├── server-actions.md   ← Contratos de createComment e toggleLike
│   └── component-api.md    ← Props dos componentes
└── checklists/
    └── requirements.md  ← Checklist da spec (aprovado)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                    # Root layout: next/font, metadata
│   ├── globals.css                   # Tailwind v4 @theme + brand tokens
│   ├── page.tsx                      # Home (placeholder)
│   └── blog/
│       └── [slug]/
│           └── page.tsx              # Página de post (US1 integração)
├── actions/
│   ├── comments.ts                   # createComment Server Action (US2)
│   └── likes.ts                      # toggleLike Server Action (US3)
├── data-access/
│   ├── posts.ts                      # getPostBySlug, getRecentPosts (US1)
│   └── comments.ts                   # getCommentsByPostId
├── components/
│   ├── ui/
│   │   ├── button.tsx                # Atom: Button
│   │   └── badge.tsx                 # Atom: Badge
│   └── blog/
│       ├── post-card.tsx             # Organism: PostCard
│       ├── comment-section.tsx       # Organism: CommentSection (US2)
│       └── like-button.tsx           # Organism: LikeButton (US3)
└── lib/
    ├── prisma.ts                     # Singleton Prisma client
    ├── types.ts                      # ActionResult<T> e tipos compartilhados
    └── schemas/
        ├── comment.schema.ts         # Zod: createCommentSchema
        ├── like.schema.ts            # Zod: toggleLikeSchema
        └── post.schema.ts            # Zod: postSlugParamsSchema

prisma/
├── schema.prisma                     # Entidades: User, Post, Comment, Like
└── seed.ts                           # Seed: 1 author + 1 post + 1 comment

docker-compose.yml                    # PostgreSQL local
.env.example                          # DATABASE_URL template
```

**Structure Decision**: Web application (Option 2 simplificado — apenas frontend/
fullstack sem backend separado, pois Next.js App Router unifica tudo em `src/`).

---

## Complexity Tracking

> Sem violações da constituição que exijam justificativa.

---

## Implementation Notes

### globals.css — Tailwind v4 Setup

```css
@import "tailwindcss";

@theme {
  --color-brand-brown:  #5D4037;
  --color-brand-green:  #1B3022;
  --color-cloud-dancer: #F0EEE9;
  --color-black:        #000000;

  --font-body: var(--font-lora);
  --font-ui:   var(--font-inter);
}

body {
  background-color: var(--color-cloud-dancer);
  color: var(--color-black);
  font-family: var(--font-ui);
  font-size: 1rem;
  line-height: 1.75;
}
```

### Fingerprint Cookie Strategy

A Server Action `toggleLike` resolve o fingerprint assim:

```typescript
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const cookieStore = await cookies();
let fingerprint = cookieStore.get("alice_fp")?.value;
if (!fingerprint) {
  fingerprint = uuidv4();
  cookieStore.set("alice_fp", fingerprint, {
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: "lax",
    httpOnly: false, // precisa ser lido no cliente para initialLiked
  });
}
```

### Cache Tags Convention

| DAL Function        | Tags Registradas                         |
|---------------------|------------------------------------------|
| getPostBySlug       | `post:<slug>`, `comments:<id>`, `likes:<id>` |
| getRecentPosts      | `posts:list`                             |
| getCommentsByPostId | `comments:<postId>`                      |

### Invalidation in Actions

```typescript
// Após createComment (Next.js 16: segundo argumento "max"):
revalidateTag(`comments:${postId}`, "max");

// Após toggleLike:
revalidateTag(`likes:${postId}`, "max");
```
