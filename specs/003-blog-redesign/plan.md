# Implementation Plan: Redesign Visual — Blog Alice

**Branch**: `003-blog-redesign` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-blog-redesign/spec.md`

---

## Summary

A feature 003 combina **redesign visual** com **nova navbar** e **preparação para extensibilidade** (004). A prioridade central é a pesquisa de referências (≥10 sites) que orienta layout por seção, animações e paleta (marrom escuro, verde escuro, branco, dark mode). Principais entregas: landing com layouts variados por categoria (hero, destaque, categorias; **mais seções futuras**: personalizar layout à vontade, como funciona o software, etc.), navbar redesenhada (logo esq, itens centro, person/dropdown dir; hamburger em &lt;768px), modal reutilizável de confirmação (logout, delete, login), página de configuração (mínima), botões curtir/comentar com opacidade baixa quando não logado + modal de login. A estrutura da landing deve ser extensível para novas seções. Tempo de leitura, split de artigo e sidebar configurável ficam para a 004.

---

## Technical Context

**Language/Version**: TypeScript 5, strict mode  
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React, Prisma (existente)  
**Storage**: N/A para 003 (nenhuma entidade nova)  
**Testing**: Smoke tests manuais conforme `quickstart.md`  
**Target Platform**: Web (browsers modernos), mobile-first  
**Project Type**: Web application (blog)  
**Performance Goals**: Layout responsivo 320px–1920px; animações respeitando `prefers-reduced-motion`  
**Constraints**: Sem novas dependências pesadas; manter qualidade gates (typecheck, lint, build)  
**Scale/Scope**: Refinamento visual de ~15 rotas existentes; novos componentes: Navbar, ConfirmModal, SettingsPage

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Status | Notas |
|-----------|--------|-------|
| I. Server-First | ✅ | Novos componentes de UI (Navbar, ConfirmModal, SettingsPage) são Client Components apenas onde necessário (eventos, estado, Intersection Observer) |
| II. Type Safety & Validation | ✅ | Props tipadas; sem novos schemas Zod (003 não altera Server Actions existentes) |
| III. Component Architecture | ✅ | `export function ComponentName()`; `src/components/ui/` e `src/components/layout/`; kebab-case |
| IV. Caching & Performance | ✅ | Nenhuma alteração em DAL; componentes Client seguem uso de `useOptimistic` onde aplicável |
| V. Design System | ✅ | Tokens existentes (`brand-brown`, `brand-green`, `cloud-dancer`); Tailwind v4 via globals.css |
| VI. Database & Data Model | ✅ | Nenhuma entidade nova; página de configuração mínima (sem persistência nova na 003) |

**Nenhuma violação identificada.**

---

## Project Structure

### Documentation (this feature)

```text
specs/003-blog-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output ✅
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── component-api.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                     # Landing — layouts variados
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── admin/posts/...
│   └── settings/page.tsx            # Nova — conteúdo mínimo
├── components/
│   ├── layout/
│   │   ├── header.tsx               # Substituído por navbar nova
│   │   ├── header-with-session.tsx  # Atualizado
│   │   └── navbar.tsx               # Novo — logo, nav, person, dropdown, hamburger
│   ├── ui/
│   │   ├── confirm-modal.tsx        # Novo — logout, delete, login
│   │   ├── theme-toggle.tsx
│   │   └── back-to-top.tsx
│   └── blog/
│       ├── hero-section.tsx         # Refinado
│       ├── featured-section.tsx     # Refinado
│       ├── categories-section.tsx   # Refinado
│       ├── landing-section.tsx      # Layout esq/dir por variante
│       ├── like-button.tsx          # Opacidade baixa quando !session
│       └── comment-section.tsx      # Opacidade + modal login
├── hooks/
│   └── use-intersection-reveal.ts   # Novo — animação de aparição
└── lib/
    └── schemas/                     # Sem alterações (003)
```

**Structure Decision**: Manter estrutura existente; adicionar `navbar.tsx`, `confirm-modal.tsx`, `settings/page.tsx`, `use-intersection-reveal.ts`. Refatorar `header.tsx` para usar nova navbar ou substituir por navbar.

---

## Complexity Tracking

Nenhuma violação do Constitution Check. Sem entradas.
