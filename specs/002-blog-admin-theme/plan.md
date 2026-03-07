# Implementation Plan: Tela Inicial, Admin e Tema — Blog Alice

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/002-blog-admin-theme/spec.md`

---

## Summary

Implementar a tela inicial inspirada no blog da Rocketseat (hero, destaque, categorias), toggle de tema light/dark com animação suave, autenticação para interações (artigos públicos; comentar/like exigem login com alerta), avatar por iniciais, footer com tópicos e contato por email, animações e transições na landing, botão voltar ao topo. Inclui correções de UX: alerta de login ao tentar comentar sem autenticação, toast de sucesso do comentário no canto inferior direito, e preservação do scroll na área de comentários após enviar comentário. Área admin para criar/editar/publicar posts (Alice).

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma 7, Zod 3, Sonner (toast)
**Storage**: PostgreSQL 16 (Docker local) — `DATABASE_URL` via `prisma.config.ts`
**Testing**: Smoke tests manuais (quickstart.md); testes automatizados deferred
**Target Platform**: Web — Next.js / Vercel
**Project Type**: Web application (full-stack, App Router)
**Performance Goals**: TTFB < 200ms para páginas cacheadas; transição de tema e animações suaves (< 300ms)
**Constraints**: TypeScript strict, sem `any`; sessão de autenticação mínima (cookie/session); tema via CSS variables + classe no `<html>`
**Scale/Scope**: 1 blog (Alice), landing + blog + admin; autenticação por email/senha; tema e comentários com ajustes de UX

---

## Constitution Check

*GATE: Deve passar antes de iniciar a implementação. Re-verificar após Phase 1.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Server-First | Rotas em `src/app/` são Server Components por padrão; DAL única camada com Prisma; mutations em Server Actions | ✅ |
| II. Type Safety | Zod em Server Actions e boundaries; `strict: true`; tipos Prisma via `src/lib/prisma.ts` | ✅ |
| III. Component Architecture | `ui/` (atoms), `blog/` (organisms), `layout/` (header/footer); `export function` para componentes | ✅ |
| IV. Caching & Performance | `"use cache"` em DAL; `cacheTag` + `revalidateTag`; optimistic UI onde aplicável | ✅ |
| V. Design System | Tokens no `@theme` do `globals.css`; tema light/dark via variáveis CSS; sem hex hardcoded | ✅ (dark mode passa a ser escopo desta feature) |
| VI. Database Integrity | Prisma como fonte única; migrations junto ao código; User com senha hasheada se auth for persistida no DB | ✅ |

**Resultado**: ✅ Sem violações — pode prosseguir para implementação.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-blog-admin-theme/
├── plan.md              ← Este arquivo
├── research.md          ← Decisões: tema (CSS vars + class), auth (session), layout Rocketseat
├── data-model.md        ← Extensões ao schema (User passwordHash, Session se necessário)
├── quickstart.md        ← Como rodar e testar a feature 002
├── contracts/
│   ├── server-actions.md   ← Contratos de auth, createComment (ajustes), theme
│   └── component-api.md    ← Props: Header, Footer, ThemeToggle, CommentSection (auth gate)
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx              # Root: Toaster position bottom-right, ThemeProvider
│   ├── globals.css             # @theme light/dark + novas cores landing + transição tema
│   ├── page.tsx                # Landing (hero, destaque, categorias, animações)
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx     # Post + CommentSection (com auth gate)
│   ├── admin/                  # Área restrita (middleware ou layout check)
│   │   └── posts/              # Listagem, criar, editar posts
│   └── login/                  # Página de login (e registro se escopo)
├── actions/
│   ├── comments.ts             # createComment: exige userId (session); retorna toast + scroll fix
│   ├── likes.ts
│   ├── auth.ts                 # login, register, logout (session)
│   └── posts.ts                # createPost, updatePost, deletePost (admin)
├── data-access/
│   ├── posts.ts
│   ├── comments.ts
│   └── users.ts                # getUserByEmail, createUser (auth)
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Navbar com tópicos (scroll suave), ThemeToggle, botão Login
│   │   └── footer.tsx         # Tópicos + link Contato (mailto ou form)
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   └── theme-toggle.tsx    # Toggle light/dark com animação
│   └── blog/
│       ├── post-card.tsx
│       ├── comment-section.tsx # Auth gate: se não logado, alerta ao tentar comentar; toast bottom-right; scroll preserve
│       ├── like-button.tsx     # Auth gate: alerta se não logado
│       └── back-to-top.tsx     # Botão voltar ao topo (visível após scroll)
├── hooks/
│   ├── use-theme.ts            # Leitura/escrita tema + animação
│   └── ...
└── lib/
    ├── auth.ts                 # Helpers de sessão (cookie ou getServerSession)
    ├── schemas/
    │   ├── auth.schema.ts      # loginSchema, registerSchema
    │   └── ...
    └── ...
```

**Structure Decision**: Mesma estrutura da 001; novos módulos `auth`, `admin`, `layout/footer`, `theme-toggle`, `back-to-top`; ajustes em `comment-section` e Toaster.

---

## Bug Fixes e Ajustes de UX (comentários)

Estes itens devem ser implementados na feature 002 (ou em um PR de correção antes):

1. **Alerta de login ao comentar sem autenticação**  
   Quando o usuário não estiver logado e tentar enviar comentário (ou focar no formulário / clicar "Enviar"), exibir alerta ou mensagem inline: "Faça login para comentar." Não permitir envio com nome/e-mail anônimo; redirecionar ou abrir modal de login. Assim o usuário não preenche nome e e-mail a cada interação.

2. **Toast de sucesso do comentário no canto inferior direito**  
   Configurar o componente Toaster (Sonner) para `position="bottom-right"` (ou equivalente) para que o toast de "Comentário enviado com sucesso" apareça no canto inferior direito.

3. **Manter scroll na área de comentários após enviar comentário**  
   Após o envio do comentário (e optimistic update), a página não deve fazer scroll para o topo. Opções: (a) não usar `router.refresh()` que remonta a árvore e perde scroll; (b) após sucesso, fazer `scrollIntoView` na seção de comentários ou no novo comentário; (c) evitar focus/submit que dispare scroll para topo. Garantir que a vista permaneça na seção de comentários.

---

## Implementation Notes

### Tema light/dark com animação

- Variáveis CSS no `globals.css`: `[data-theme="light"]` e `[data-theme="dark"]` (ou classe no `<html>`).
- Transição suave: `transition: background-color 0.2s ease, color 0.2s ease` (ou similar) em `body` / containers principais.
- Hook `useTheme`: lê preferência (localStorage/cookie), aplica `data-theme` no `<html>`, persiste ao trocar; opcionalmente respeita `prefers-color-scheme` quando o usuário nunca escolheu.

### Autenticação (mínima)

- Sessão via cookie (ex.: session token) ou NextAuth.js simplificado; usuário com nome, email, senha (hash no DB).
- Comment/Like: Server Action exige `userId` da sessão; se não houver, retorna `{ success: false, error: "login_required" }`; cliente exibe alerta e redireciona para `/login` ou abre modal.
- Avatar: iniciais + cor derivada do nome (já existente em helpers); sem foto.

### Landing (referência Rocketseat)

- Hero/CTA no topo; seção "Artigos em destaque" (posts recentes ou em destaque); seção "Explore categorias" (tags ou categorias); variação de cores por seção usando tokens do globals.
- Navbar: links para âncoras (`#destaque`, `#categorias`, etc.) com `scrollBehavior: 'smooth'` ou `scrollIntoView({ behavior: 'smooth' })`.
- Botão "Voltar ao topo": visível quando `window.scrollY > threshold`; ao clicar, `window.scrollTo({ top: 0, behavior: 'smooth' })`.
- Animações: entrada de seções (fade-in, slide-up) com CSS ou lib leve; evitar animações pesadas.

### Footer

- Tópicos: links para seções da home ou páginas (Blog, Sobre, Categorias).
- "Entrar em contato": link `mailto:alice@...` ou formulário que envia email (Server Action + Resend/Nodemailer ou similar).

### Toaster (Sonner)

- No `layout.tsx`: `<Toaster position="bottom-right" ... />` para que todos os toasts (incluindo sucesso de comentário) apareçam no canto inferior direito.

---

## Complexity Tracking

> Sem violações da constituição que exijam justificativa.

---

## Dependencies

- **Feature 001**: Base de posts, comentários, likes, DAL, design system, CommentSection, LikeButton. Ajustes de comentário (alerta login, toast position, scroll) aplicados na 002.
