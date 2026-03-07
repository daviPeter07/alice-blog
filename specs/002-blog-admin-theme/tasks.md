# Tasks: Tela Inicial, Admin e Tema — Blog Alice

**Input**: Design documents from `specs/002-blog-admin-theme/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Smoke tests manuais definidos em `quickstart.md` — testes automatizados não solicitados.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

---

## Format: `- [ ] [ID] [P?] [Story?] Descrição com caminho de arquivo`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: A qual user story pertence (US1, US2, US3, US4, US5, US6)

---

## Phase 1: Setup (Infraestrutura 002)

**Purpose**: Dependências e verificação da base 001.

- [X] T001 Verificar que a base da feature 001 está aplicada (src/app, actions, data-access, components blog) e adicionar dependência de hash de senha (ex.: `bcrypt` ou `argon2`) em `package.json` se ainda não presente para auth

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Tema e autenticação que várias user stories dependem.

**⚠️ CRÍTICO**: Nenhuma user story de conteúdo/auth pode começar antes desta fase estar completa.

- [X] T002 Adicionar variáveis CSS de tema light/dark e seletor `[data-theme="light"]` / `[data-theme="dark"]` com transição suave em `src/app/globals.css`
- [X] T003 [P] Criar `src/lib/schemas/auth.schema.ts` com `loginSchema` e `registerSchema` (Zod) conforme `specs/002-blog-admin-theme/data-model.md`
- [X] T004 Criar `src/lib/auth.ts` com helper `getSession()` (leitura de cookie de sessão) e funções para criar/destruir sessão (cookie)
- [X] T005 Adicionar campo `passwordHash` (opcional) ao modelo `User` em `prisma/schema.prisma`, gerar migration com `pnpm prisma migrate dev --name add-user-password-hash`
- [X] T006 [P] Criar `src/data-access/users.ts` com `getUserByEmail(email)` e `createUser(data)` (hash de senha no create) usando `prisma`
- [X] T007 Criar `src/actions/auth.ts` com Server Actions `login`, `register` e `logout` (validação Zod, sessão via cookie, retorno `ActionResult`)

**Checkpoint**: Tema e auth base prontos — landing, tema toggle, comentários com login e admin podem ser implementados.

---

## Phase 3: User Story 1 — Tela inicial inspirada no Rocketseat (Priority: P1) 🎯 MVP

**Goal**: Visitante acessa `/` e vê hero/destaque, artigos em destaque, categorias, navbar com scroll suave para âncoras, botão voltar ao topo e animações leves.

**Independent Test**: Acessar `/`, ver hero e seções destaque e categorias; clicar em item da navbar e ver scroll suave; rolar e ver botão "Voltar ao topo"; clicar e voltar ao topo com transição suave.

### Implementação — User Story 1

- [X] T008 [P] [US1] Criar `src/components/ui/back-to-top.tsx` com botão visível quando `window.scrollY > threshold` (ex.: 400), ao clicar `window.scrollTo({ top: 0, behavior: 'smooth' })`, export function `BackToTop`
- [X] T009 [US1] Atualizar `src/components/layout/header.tsx` para aceitar `navAnchors` (ex.: `{ href: '#destaque', label: 'Destaques' }`) e, para links com `href` iniciando por `#`, usar scroll suave (link nativo com `scroll-behavior: smooth` em `globals.css` ou `scrollIntoView`) em `src/app/globals.css` adicionar `html { scroll-behavior: smooth; }` se ainda não existir
- [X] T010 [US1] Reescrever `src/app/page.tsx` como landing: seção hero/CTA no topo, seção "Artigos em destaque" com `id="destaque"` usando dados de `getRecentPosts()` (ou DAL existente), seção "Explore categorias" com `id="categorias"` usando tags dos posts, variação de cores por seção via classes Tailwind e tokens em `src/app/globals.css`
- [X] T011 [US1] Incluir componente `BackToTop` na landing em `src/app/page.tsx` (ou no layout) e garantir que ele seja exibido após scroll além do threshold
- [X] T012 [US1] Adicionar animações leves (entrada de seções, ex.: fade-in ou slide-up) nas seções da landing em `src/app/page.tsx` e/ou classes em `src/app/globals.css` sem prejudicar acessibilidade

**Checkpoint**: US1 funcional — landing com hero, destaque, categorias, navbar com âncoras, voltar ao topo e animações.

---

## Phase 4: User Story 2 — Tema light/dark com animação (Priority: P2)

**Goal**: Usuário alterna entre tema claro e escuro com transição suave; preferência persistida e reaplicada ao recarregar.

**Independent Test**: Clicar no toggle de tema, observar transição; recarregar e verificar que o tema permanece.

### Implementação — User Story 2

- [X] T013 [P] [US2] Criar `src/hooks/use-theme.ts`: ler/escrever tema (ex.: `localStorage` chave `alice-theme`), aplicar `data-theme` em `<html>`, respeitar `prefers-color-scheme` quando não houver preferência salva
- [X] T014 [US2] Criar `src/components/ui/theme-toggle.tsx` como Client Component usando o hook de tema, com `aria-label` e transição visual (animação leve) em `src/app/globals.css` garantir `transition` em `body` ou container principal para `background-color` e `color` (ex.: 0.2s ease)
- [X] T015 [US2] Integrar `ThemeToggle` no `src/components/layout/header.tsx` e garantir que o tema seja aplicado no `<html>` antes da primeira paint (script inline no layout ou Provider que roda no cliente) em `src/app/layout.tsx`

**Checkpoint**: US2 funcional — toggle de tema com animação e persistência.

---

## Phase 5: User Story 3 — Interações exigem login; avatar por iniciais (Priority: P3)

**Goal**: Comentar e dar like exigem login; visitante não logado vê alerta ao tentar interagir; usuário logado usa avatar por iniciais; login e registro com nome, email e senha.

**Independent Test**: Sem login, tentar comentar → alerta "Faça login para comentar"; fazer login e comentar → comentário aparece com avatar por iniciais.

### Implementação — User Story 3

- [X] T016 [US3] Criar `src/app/login/page.tsx` com formulário de login (email, senha), chamada à action `login`, redirecionamento após sucesso e link para registro
- [X] T017 [US3] Criar `src/app/login/register/page.tsx` com formulário de registro (nome, email, senha), chamada à action `register`, redirecionamento após sucesso e link para login
- [X] T018 [US3] Atualizar `src/actions/comments.ts`: no início obter sessão com `getSession()`; se não houver usuário retornar `{ success: false, error: "login_required" }`; quando logado preencher `authorName` e `authorEmail` a partir do User da sessão (não do FormData)
- [X] T019 [US3] Atualizar `src/actions/likes.ts`: no início obter sessão; se não houver usuário retornar `{ success: false, error: "login_required" }`
- [X] T020 [US3] Atualizar `src/components/blog/comment-section.tsx` para aceitar props `isAuthenticated` e `currentUser` (opcional); quando `!isAuthenticated` e usuário tentar enviar comentário (submit ou foco no form) exibir alerta ou mensagem inline "Faça login para comentar" com link para `/login` e não submeter; quando `isAuthenticated` e `currentUser` preencher nome/email do form a partir de currentUser e ocultar campos nome/email do formulário
- [X] T021 [US3] Atualizar `src/components/blog/like-button.tsx` para aceitar prop `isAuthenticated`; quando `!isAuthenticated` e usuário clicar exibir alerta "Faça login para curtir" com link para `/login` e não chamar toggleLike
- [X] T022 [US3] Atualizar `src/app/blog/[slug]/page.tsx`: obter sessão no Server Component e passar `isAuthenticated` e `currentUser` (name, email) para `CommentSection` e `isAuthenticated` para `LikeButton`
- [X] T023 [US3] Adicionar botão "Login" no `src/components/layout/header.tsx` (visível quando não autenticado) com link para `/login`

**Checkpoint**: US3 funcional — login/registro, comentários e likes exigem login com alerta; avatar por iniciais já existente em comentários.

---

## Phase 6: User Story 4 — Footer com tópicos e contato (Priority: P4)

**Goal**: Footer com tópicos (links) e botão/link para contato com a Alice por email.

**Independent Test**: Rolar até o footer, ver tópicos e "Entrar em contato"; clicar em contato e abrir mailto ou formulário.

### Implementação — User Story 4

- [X] T024 [P] [US4] Criar `src/components/layout/footer.tsx` com props `topics` (array de `{ href, label }`) e `contactEmail`/`contactLabel`, renderizar tópicos e link `mailto:` para contato, export function `Footer`
- [X] T025 [US4] Incluir `Footer` em `src/app/layout.tsx` (ou em layout compartilhado) passando tópicos (ex.: Blog, Sobre, âncoras da home) e email da Alice para contato

**Checkpoint**: US4 funcional — footer visível com tópicos e contato por email.

---

## Phase 7: User Story 5 — Admin cria, edita e publica posts (Priority: P5)

**Goal**: Admin autenticado acessa `/admin/posts`, lista posts, cria/edita/publica/despublica e remove posts.

**Independent Test**: Login como admin, acessar `/admin/posts`, criar rascunho, publicar e ver post na listagem pública.

### Implementação — User Story 5

- [X] T026 [US5] Criar middleware ou verificação em layout em `src/app/admin` que exige sessão com `role === "ADMIN"`; redirecionar para `/auth/login` ou exibir 403
- [X] T027 [US5] Criar `src/lib/schemas/post.schema.ts` (ou estender) com schemas Zod para createPost e updatePost (título, slug, excerpt, content, tags, status) conforme `data-model.md` e contracts
- [X] T028 [US5] Criar `src/actions/posts.ts` com Server Actions `createPost`, `updatePost`, `deletePost` e `publishPost`/`unpublishPost` (exigir sessão ADMIN, validar com Zod, chamar prisma, `revalidateTag("posts:list", "max")` e tags do post)
- [X] T029 [US5] Criar `src/app/admin/posts/page.tsx` para listar posts (usar DAL ou nova função `getPostsForAdmin` em `src/data-access/posts.ts`) com links para editar e criar novo
- [X] T030 [US5] Criar `src/app/admin/posts/new/page.tsx` com formulário de criação de post (título, slug, excerpt, content, tags, status DRAFT) e submit para `createPost`
- [X] T031 [US5] Criar `src/app/admin/posts/[id]/edit/page.tsx` com formulário de edição e submit para `updatePost`; botões para publicar/despublicar e remover

**Checkpoint**: US5 funcional — área admin restrita com CRUD e publicação de posts.

---

## Phase 8: User Story 6 — Correção de bugs (toast, scroll, alerta) (Priority: P6)

**Goal**: Toast de sucesso do comentário no canto inferior direito; após enviar comentário manter scroll na área de comentários; alerta de login já coberto em US3.

**Independent Test**: Enviar comentário logado → toast aparece no canto inferior direito; view permanece na seção de comentários (não salta para o topo).

### Implementação — User Story 6

- [X] T032 [US6] Configurar componente Toaster (Sonner) em `src/app/layout.tsx` com `position="bottom-right"` para que toasts de sucesso (ex.: comentário enviado) apareçam no canto inferior direito
- [X] T033 [US6] Em `src/components/blog/comment-section.tsx` (ou hook `use-comment-section.ts`): após envio bem-sucedido de comentário não disparar navegação ou refresh que cause scroll para o topo; opcionalmente chamar `scrollIntoView({ behavior: 'smooth' })` na seção de comentários ou no novo comentário para manter foco na área

**Checkpoint**: US6 funcional — toast bottom-right e scroll preservado na área de comentários.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Qualidade e validação final.

- [X] T034 [P] Executar `pnpm typecheck` e corrigir erros de tipo até zero
- [X] T035 [P] Executar `pnpm lint` e corrigir warnings até zero
- [X] T036 Executar `pnpm build` e corrigir erros de build até sucesso
- [ ] T037 Validar smoke tests manuais descritos em `specs/002-blog-admin-theme/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sem dependências — pode começar imediatamente
- **Phase 2 (Foundational)**: Depende da Phase 1 — BLOQUEIA US1–US5 (tema e auth)
- **Phase 3 (US1)**: Depende da Phase 2 (Header já pode ter ThemeToggle depois; landing não exige auth)
- **Phase 4 (US2)**: Depende da Phase 2 (variáveis de tema em globals)
- **Phase 5 (US3)**: Depende da Phase 2 (auth e session)
- **Phase 6 (US4)**: Depende do layout — pode ser feita após US1 (Footer na landing)
- **Phase 7 (US5)**: Depende da Phase 2 (auth e role ADMIN)
- **Phase 8 (US6)**: Pode ser feita em paralelo ou após US3 (toast e scroll independem de auth)
- **Phase 9 (Polish)**: Depende de todas as stories desejadas concluídas

### User Story Dependencies

- **US1 (P1)**: Após Foundational — landing, header, back-to-top, animações
- **US2 (P2)**: Após Foundational — tema toggle e persistência
- **US3 (P3)**: Após Foundational — login/register, gate em comentários e likes
- **US4 (P4)**: Após layout/header — footer com tópicos e contato
- **US5 (P5)**: Após Foundational — admin e CRUD de posts
- **US6 (P6)**: Independente — ajustes de Toaster e scroll em CommentSection

### Parallel Opportunities

- T003 e T006 (schemas e DAL users) podem rodar em paralelo
- T008 (BackToTop) e T009 (Header) podem rodar em paralelo na US1
- T013 (useTheme) pode rodar em paralelo com outras tasks da US2
- T024 (Footer) é paralelizável com outras tasks da US4
- T034 e T035 (typecheck e lint) podem rodar em paralelo na Polish

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational (tema + auth)
3. Completar Phase 3: US1 (landing, hero, destaque, categorias, navbar, voltar ao topo, animações)
4. **PARAR e VALIDAR**: Acessar `/` e verificar todos os cenários da US1
5. Deploy/demo se desejado

### Incremental Delivery

1. Setup + Foundational → base tema e auth
2. US1 → Landing profissional → MVP da 002
3. US2 → Tema light/dark com animação
4. US3 → Login e gate de interações (comentar/like)
5. US4 → Footer e contato
6. US5 → Área admin
7. US6 → Ajustes de toast e scroll
8. Polish → typecheck, lint, build, smoke tests

---

## Notes

- Cada task deve incluir caminho de arquivo explícito
- Commit sugerido após cada phase: `feat(002): phase N — <descrição>`
- Verificar `pnpm typecheck` após cada phase antes de avançar
- Alerta de login ao comentar sem autenticação está na US3 (T020); toast position e scroll na US6 (T032, T033)
