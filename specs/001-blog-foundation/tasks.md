# Tasks: Blog Foundation — Estrutura Base

**Input**: Design documents from `specs/001-blog-foundation/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Smoke tests manuais definidos em `quickstart.md` — testes automatizados não solicitados.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

---

## Format: `- [ ] [ID] [P?] [Story?] Descrição com caminho de arquivo`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: A qual user story pertence (US1, US2, US3)

---

## Phase 1: Setup (Infraestrutura Inicial)

**Purpose**: Configuração do projeto e dependências base.

- [ ] T001 Configurar `docker-compose.yml` com serviço PostgreSQL 16 (usuário: alice, senha: alice, db: alice_blog_dev, porta: 5432)
- [ ] T002 Criar `.env.example` com `DATABASE_URL="postgresql://alice:alice@localhost:5432/alice_blog_dev"`
- [ ] T003 [P] Instalar dependências adicionais: `pnpm add uuid`; `pnpm add -D @types/uuid`
- [ ] T004 [P] Instalar Prisma: `pnpm add @prisma/client`; `pnpm add -D prisma`; executar `pnpm prisma init --datasource-provider postgresql`
- [ ] T005 [P] Adicionar scripts ao `package.json`: `"typecheck": "tsc --noEmit"`, `"prisma": "prisma"`, `"db:seed": "tsx prisma/seed.ts"`
- [ ] T006 Verificar `tsconfig.json` — confirmar `"strict": true` e adicionar paths `"@/*": ["./src/*"]` se ausente
- [ ] T007 [P] Configurar `next.config.ts` com `reactCompiler: true` e habilitar `"use cache"` experimental

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Infraestrutura de dados e tipos que TODAS as user stories dependem.

**⚠️ CRÍTICO**: Nenhuma user story pode começar antes desta fase estar completa.

- [ ] T008 Criar `prisma/schema.prisma` com enums `Role` e `PostStatus` e modelos `User`, `Post`, `Comment` (self-relation replies via `parentId`), `Like` (@@unique([postId, fingerprint])) com todos os `@@map` em snake_case conforme `data-model.md`
- [ ] T009 Executar `pnpm prisma migrate dev --name init` para gerar a migration inicial e o Prisma Client
- [ ] T010 Criar `src/lib/prisma.ts` com singleton do PrismaClient (guard `globalThis.__prisma` para hot-reload do Next.js)
- [ ] T011 [P] Criar `src/lib/types.ts` com o tipo `ActionResult<T>`, `PostWithRelations`, `CommentWithReplies` e `PostSummary` conforme `contracts/server-actions.md`
- [ ] T012 [P] Criar `src/lib/schemas/comment.schema.ts` com `createCommentSchema` (postId cuid, parentId opcional, authorName min2/max100, authorEmail email, body min3/max5000) conforme `data-model.md`
- [ ] T013 [P] Criar `src/lib/schemas/like.schema.ts` com `toggleLikeSchema` (postId cuid) conforme `data-model.md`
- [ ] T014 [P] Criar `src/lib/schemas/post.schema.ts` com `postSlugParamsSchema` (slug min1/max200, regex `^[a-z0-9-]+$`) conforme `data-model.md`
- [ ] T015 Criar `prisma/seed.ts` com 1 User ADMIN (`alice@aliceblog.dev`), 1 Post PUBLISHED (`slug: "hello-world"`) e 1 Comment de exemplo; adicionar `"prisma": { "seed": "tsx prisma/seed.ts" }` ao `package.json`
- [ ] T016 Executar `pnpm prisma db seed` para popular o banco e verificar dados via `pnpm prisma studio`

**Checkpoint**: Foundation pronta — implementação das user stories pode começar em paralelo.

---

## Phase 3: User Story 1 — Leitor acessa post pelo slug (Priority: P1) 🎯 MVP

**Goal**: Visitante acessa `/blog/hello-world` e vê título, autor, data e corpo do post.

**Independent Test**: Executar `pnpm dev`, acessar `http://localhost:3000/blog/hello-world`.
Se a página renderizar o conteúdo do seed, a US1 está completa. Acessar `/blog/nao-existe` deve retornar 404.

### Implementação — User Story 1

- [ ] T017 [P] [US1] Criar `src/data-access/posts.ts` com `getPostBySlug(slug)` usando `"use cache"`, `cacheTag("post:<slug>")`, `cacheTag("comments:<post.id>")`, `cacheTag("likes:<post.id>")`, include de `author`, `comments` (com `replies`) e `_count.likes`; retornar `null` se não encontrado
- [ ] T018 [P] [US1] Criar `src/data-access/comments.ts` com `getCommentsByPostId(postId)` usando `"use cache"` e `cacheTag("comments:<postId>")`; retornar apenas comments raiz (`parentId: null`) com `replies` aninhados
- [ ] T019 [US1] Reescrever `src/app/globals.css` com `@import "tailwindcss"`, bloco `@theme` com tokens `--color-brand-brown: #5D4037`, `--color-brand-green: #1B3022`, `--color-cloud-dancer: #F0EEE9`, `--color-black: #000000`, `--font-body: var(--font-lora)`, `--font-ui: var(--font-inter)` e estilos base de `body` (background, cor, font, line-height 1.75)
- [ ] T020 [US1] Reescrever `src/app/layout.tsx` com `next/font/google` carregando `Lora` (variável `--font-lora`) e `Inter` (variável `--font-inter`), aplicar variáveis CSS no `<html>`, definir `metadata` base do blog
- [ ] T021 [P] [US1] Criar `src/components/ui/button.tsx` com `export function Button(props: ButtonProps)`, variantes `primary | ghost | outline`, tamanhos `sm | md | lg`, prop `isLoading`; usar tokens de cor via classes Tailwind (sem hex hardcoded)
- [ ] T022 [P] [US1] Criar `src/components/ui/badge.tsx` com `export function Badge(props: BadgeProps)`, variantes `default | muted`; usar tokens de cor via classes Tailwind
- [ ] T023 [P] [US1] Criar `src/components/blog/post-card.tsx` com `export function PostCard(props: PostCardProps)` (slug, title, excerpt, publishedAt, tags, readingTime, author, likesCount, commentsCount); link para `/blog/<slug>`; usar `Badge` para tags
- [ ] T024 [US1] Criar `src/app/blog/[slug]/page.tsx` como Server Component: aguardar `params`, validar `slug` com `postSlugParamsSchema.safeParse()`, chamar `getPostBySlug(slug)`, retornar `notFound()` se null ou DRAFT; renderizar título, autor (com `next/image` para avatar), data formatada, corpo do post, seção de comentários (placeholder `<div>` por enquanto) e botão de like (placeholder por enquanto); passar `post.id`, `post._count.likes` e `post.comments` como props

**Checkpoint**: US1 funcional — `/blog/hello-world` renderiza corretamente, `/blog/nao-existe` retorna 404.

---

## Phase 4: User Story 2 — Leitor comenta em um post (Priority: P2)

**Goal**: Visitante preenche formulário de comentário, vê o comentário aparecer na lista imediatamente (optimistic) e o comentário persiste após reload.

**Independent Test**: Na página do seed post, preencher o formulário e clicar "Enviar". O comentário deve aparecer imediatamente sem reload. Tentar enviar com campos inválidos deve mostrar erros inline.

### Implementação — User Story 2

- [ ] T025 [US2] Criar `src/actions/comments.ts` com `export async function createComment(prevState, formData)`: extrair campos do FormData, `createCommentSchema.safeParse()`, se inválido retornar `{ success: false, fieldErrors: zodError.flatten().fieldErrors }`, criar comentário via `prisma.comment.create()`, chamar `revalidateTag("comments:<postId>")`, retornar `ActionResult<CommentData>` conforme contrato em `contracts/server-actions.md`
- [ ] T026 [US2] Criar `src/components/blog/comment-section.tsx` como Client Component (`"use client"`): receber `postId` e `initialComments`; usar `useActionState(createComment, null)` para gerenciar estado do formulário; usar `useOptimistic` para adicionar comentário na lista imediatamente ao submeter; renderizar lista de comentários com replies aninhados, formulário com campos name/email/body, mensagens de erro inline por campo (`state.fieldErrors`), indicador de loading com `isPending`
- [ ] T027 [US2] Atualizar `src/app/blog/[slug]/page.tsx` para substituir o placeholder de comentários pelo `<CommentSection postId={post.id} initialComments={post.comments} />` real

**Checkpoint**: US1 + US2 funcionais — comentários aparecem otimisticamente e persistem.

---

## Phase 5: User Story 3 — Leitor reage com Like (Priority: P3)

**Goal**: Visitante clica em Like, contador incrementa imediatamente (optimistic), ação é idempotente (toggle), persiste após reload.

**Independent Test**: Na página do seed post, clicar no botão Like. Contador deve incrementar imediatamente. Clicar novamente deve decrementar (toggle). Após reload, o estado deve persistir.

### Implementação — User Story 3

- [ ] T028 [US3] Criar `src/actions/likes.ts` com `export async function toggleLike(formData)`: ler `fingerprint` do cookie `alice_fp` via `cookies()`, gerar UUID v4 e setar cookie se ausente (SameSite: lax, MaxAge: 1 ano, httpOnly: false), `toggleLikeSchema.safeParse({ postId })`, buscar like existente via `prisma.like.findUnique`, deletar ou criar conforme estado, `revalidateTag("likes:<postId>")`, retornar `ActionResult<{ liked: boolean; totalLikes: number }>` conforme contrato
- [ ] T029 [US3] Criar `src/components/blog/like-button.tsx` como Client Component (`"use client"`): receber `postId`, `initialCount`, `initialLiked`; usar `useOptimistic` para atualizar contador e estado liked imediatamente; usar `startTransition` + `formAction` para chamar `toggleLike`; renderizar botão com ícone de coração, contador e estado visual liked/not-liked usando tokens de cor
- [ ] T030 [US3] Atualizar `src/app/blog/[slug]/page.tsx`: ler cookie `alice_fp` no Server Component via `cookies()` para derivar `initialLiked` (verificar se fingerprint tem like no post); substituir placeholder de like pelo `<LikeButton postId={post.id} initialCount={post._count.likes} initialLiked={initialLiked} />` real

**Checkpoint**: US1 + US2 + US3 funcionais — todas as interações do MVP operacionais.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finais de qualidade, acessibilidade e verificação da constituição.

- [ ] T031 [P] Verificar que `next/image` é usado para todas as imagens (avatar do autor, cover image futura) com `width`/`height` explícitos ou `fill`
- [ ] T032 [P] Adicionar `export default` → converter para `export function` em todos os componentes que usarem `export default` (verificar conformidade com Princípio III)
- [ ] T033 [P] Auditar todos os componentes e verificar que nenhum valor hexadecimal está hardcoded — apenas classes Tailwind com tokens de marca (Princípio V)
- [ ] T034 [P] Adicionar atributos de acessibilidade básicos: `aria-label` no botão de like, `aria-live="polite"` na lista de comentários para leitores de tela
- [ ] T035 Executar smoke tests completos do `quickstart.md`: US1 (leitura + 404), US2 (comentário válido + erros inline + reply), US3 (like toggle + persistência)
- [ ] T036 [P] Executar `pnpm typecheck` — corrigir todos os erros de tipo até zero
- [ ] T037 [P] Executar `pnpm lint` — corrigir todos os warnings ESLint até zero
- [ ] T038 Executar `pnpm build` — verificar que a build de produção passa sem erros

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode começar imediatamente
- **Foundational (Phase 2)**: Depende do Setup (T001–T007) — BLOQUEIA todas as user stories
- **US1 (Phase 3)**: Depende da Foundational — sem dependência de US2 ou US3
- **US2 (Phase 4)**: Depende da Foundational + US1 (page.tsx existe para integrar o componente)
- **US3 (Phase 5)**: Depende da Foundational + US1 (mesma razão)
- **Polish (Phase 6)**: Depende de todas as stories desejadas estarem completas

### User Story Dependencies

- **US1 (P1)**: Pode iniciar após Foundational — sem dependência de US2/US3
- **US2 (P2)**: Pode iniciar após Foundational — integra na page.tsx que US1 cria (T027 depende de T024)
- **US3 (P3)**: Pode iniciar após Foundational — integra na page.tsx que US1 cria (T030 depende de T024)

### Within Each User Story

- Schemas (T012–T014) antes das Actions que os usam
- DAL functions (T017–T018) antes da page.tsx que as chama
- `layout.tsx` e `globals.css` (T019–T020) antes de qualquer componente visual
- Componentes UI atoms (T021–T022) antes dos organismos blog que os usam
- Server Actions (T025, T028) antes dos Client Components que as chamam

### Parallel Opportunities

- T003, T004, T005 — instalação de dependências distintas
- T011, T012, T013, T014 — schemas e tipos independentes entre si
- T017, T018 — funções DAL em arquivos diferentes
- T021, T022, T023 — componentes UI/blog independentes entre si
- T031, T032, T033, T034, T036, T037 — tasks de polish em arquivos diferentes

---

## Parallel Execution Examples

### Phase 2 — Foundational (após T008+T009)

```bash
# Executar em paralelo (arquivos diferentes):
Task T010: src/lib/prisma.ts
Task T011: src/lib/types.ts
Task T012: src/lib/schemas/comment.schema.ts
Task T013: src/lib/schemas/like.schema.ts
Task T014: src/lib/schemas/post.schema.ts
Task T015: prisma/seed.ts
```

### Phase 3 — US1 (após Foundation completa)

```bash
# Executar em paralelo:
Task T017: src/data-access/posts.ts
Task T018: src/data-access/comments.ts
Task T019: src/app/globals.css
Task T021: src/components/ui/button.tsx
Task T022: src/components/ui/badge.tsx
Task T023: src/components/blog/post-card.tsx

# Depois (dependem dos acima):
Task T020: src/app/layout.tsx (usa fontes)
Task T024: src/app/blog/[slug]/page.tsx (usa DAL + componentes)
```

---

## Implementation Strategy

### MVP First (US1 apenas — leitura de post)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (CRÍTICO — bloqueia tudo)
3. Completar Phase 3: US1
4. **PARAR e VALIDAR**: `http://localhost:3000/blog/hello-world` renderiza ✅
5. Deploy/demo se pronto

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → leitor pode ler posts → **MVP deployável**
3. US2 → leitor pode comentar → adiciona interação social
4. US3 → leitor pode dar like → complementa engajamento
5. Polish → qualidade de produção

---

## Notes

- `[P]` = arquivos diferentes, sem dependências incompletas entre as tarefas marcadas
- `[USn]` = mapeia a tarefa para a user story correspondente na spec.md
- Cada checkpoint verifica a story de forma independente antes de avançar
- Commit sugerido após cada phase: `feat(foundation): phase N — <descrição>`
- Verificar `pnpm typecheck` após cada fase antes de avançar para a próxima
