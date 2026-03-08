# Tasks: Redesign Visual — Blog Alice

**Input**: Design documents from `specs/003-blog-redesign/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | research.md ✅ | data-model.md ✅ | contracts/ ✅

**Tests**: Smoke tests manuais definidos em `quickstart.md` — testes automatizados não solicitados.

**Organization**: Tarefas agrupadas por user story para implementação e validação independentes.

---

## Format: `- [ ] [ID] [P?] [Story?] Descrição com caminho de arquivo`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências incompletas)
- **[Story]**: A qual user story pertence (US1, US2, US3, US4, US5, US6, US7)

---

## Phase 1: Setup (Infraestrutura 003)

**Purpose**: Verificar base e referências antes de implementar.

- [ ] T001 Verificar que features 001 e 002 estão aplicadas (src/app, components, auth, tema) e que `specs/003-blog-redesign/research.md` está disponível com ≥10 referências
- [ ] T002 [P] Adicionar `@radix-ui/react-dialog` em `package.json` para ConfirmModal acessível (ou usar `<dialog>` nativo se preferir sem dependência)

---

## Phase 2: Foundational (Pré-requisitos Bloqueantes)

**Purpose**: Componentes compartilhados que várias user stories dependem.

**⚠️ CRÍTICO**: Nenhuma user story pode começar antes desta fase estar completa.

- [ ] T003 [P] Criar `src/hooks/use-intersection-reveal.ts`: hook com Intersection Observer que adiciona classe `is-visible` ao entrar no viewport; respeitar `prefers-reduced-motion` (opção `disabled`)
- [ ] T004 [P] Criar ou atualizar `src/components/blog/landing-section.tsx` com variantes `text-left`, `text-right`, `center` conforme `specs/003-blog-redesign/contracts/component-api.md`; estrutura extensível para seções futuras (personalizar layout, como funciona, etc.)
- [ ] T005 Criar `src/components/ui/confirm-modal.tsx` com variantes `confirm`, `delete`, `login`; props `open`, `onOpenChange`, `variant`, `title`, `message`, `onConfirm`, `confirmLabel`, `cancelLabel`; variant `login` redireciona para `/auth/login` ao confirmar
- [ ] T006 [P] Adicionar classes CSS para animação reveal em `src/app/globals.css`: `.reveal-section`, `.is-visible`, e `@media (prefers-reduced-motion: reduce)` para desativar animações

**Checkpoint**: useIntersectionReveal, LandingSection, ConfirmModal e estilos de reveal prontos.

---

## Phase 3: User Story 6 — Referências (Priority: P5) *Prioridade central*

**Goal**: Documentar referências; layouts e animações devem seguir pesquisa em `research.md` antes de implementar.

**Independent Test**: Validar que `research.md` contém ≥10 referências com layout, animações e paleta (marrom, verde, branco, dark mode).

- [ ] T007 [US6] Validar que `specs/003-blog-redesign/research.md` documenta ≥10 sites de referência com layout, animações e paleta; atualizar se faltar alguma referência

**Checkpoint**: Referências validadas — implementação pode seguir padrões definidos.

---

## Phase 4: User Story 2 — Navbar redesenhada (Priority: P1)

**Goal**: Navbar com logo esq, nav centro, person/dropdown dir; hamburger em &lt;768px; "Entre | Cadastre-se"; dropdown com Configurações e Sair.

**Independent Test**: Acessar qualquer página; verificar layout navbar; em mobile, abrir hamburger; clicar Entre/Cadastre-se; logado, abrir dropdown e Sair (modal).

### Implementação — User Story 2

- [ ] T008 [US2] Criar `src/components/layout/navbar.tsx`: logo à esquerda, itens de navegação ao centro (prop `navAnchors`), toggle de tema + person/auth à direita; quando não logado: ícone person (Lucide) + "Seja bem-vindo" + **Entre** ou **Cadastre-se** (dois links para `/auth/login` e `/auth/register`); "Entre" e "Cadastre-se" em bold; `navAnchors` extensível para seções futuras (personalizar layout, como funciona, etc.)
- [ ] T009 [US2] Implementar dropdown no `src/components/layout/navbar.tsx` quando logado: ícone person + nome; itens "Configurações" → `/settings`, "Sair" → abre ConfirmModal (variant `confirm`), ao confirmar chama logout
- [ ] T010 [US2] Implementar menu hamburger em `src/components/layout/navbar.tsx` para viewport &lt;768px (breakpoint Tailwind `md`); ao abrir, exibir itens e ações em overlay/drawer
- [ ] T011 [US2] Criar `src/app/settings/page.tsx`: rota protegida (exige sessão, redirect `/auth/login`); conteúdo mínimo (título "Configurações"); estrutura base para 004
- [ ] T012 [US2] Substituir ou refatorar `src/components/layout/header.tsx` e `src/components/layout/header-with-session.tsx` para usar Navbar; atualizar `src/app/layout.tsx` para renderizar Navbar em vez de Header/HeaderWithSession

**Checkpoint**: Navbar funcional; hamburger em mobile; dropdown; settings page.

---

## Phase 5: User Story 1 — Landing com layouts variados (Priority: P1)

**Goal**: Seções com layout por categoria (hero text-left, destaque text-right, categorias conforme research); animações de aparição; paleta marrom/verde/branco/dark. Estrutura extensível para seções futuras (personalizar layout, como funciona o software, etc.).

**Independent Test**: Acessar `/`; verificar layouts variados; animações ao rolar; `prefers-reduced-motion` respeitado; estrutura em `src/app/page.tsx` e `LandingSection` permite adicionar novas seções sem refatoração.

### Implementação — User Story 1

- [ ] T013 [US1] Refatorar `src/components/blog/hero-section.tsx` para usar LandingSection com `layout="text-left"` (texto esq, CTA/visual dir) conforme `research.md`
- [ ] T014 [US1] Refatorar `src/components/blog/featured-section.tsx` para usar LandingSection com `layout="text-right"` (texto dir, cards esq) conforme `research.md`
- [ ] T015 [US1] Refatorar `src/components/blog/categories-section.tsx` para usar LandingSection com layout central ou grid conforme `research.md`
- [ ] T016 [US1] Aplicar `useIntersectionReveal` e classes de animação nas seções da landing em `src/app/page.tsx`; garantir que `prefers-reduced-motion` desativa animações
- [ ] T017 [US1] Revisar paleta em `src/app/globals.css` e seções da landing para consistência com marrom escuro, verde escuro, branco e dark mode conforme `research.md`; garantir que `src/app/page.tsx` e `navAnchors` permitam adicionar novas seções futuras (personalizar layout, como funciona, etc.) sem refatoração estrutural

**Checkpoint**: Landing com layouts variados e animações; paleta aplicada; estrutura extensível.

---

## Phase 6: User Story 3 — Blog refinado e modal para login (Priority: P2)

**Goal**: Curtir e comentar com opacidade baixa quando !session; ao clicar, modal redirecionando para login. Refinamentos visuais em blog.

**Independent Test**: Sem login, abrir post; curtir/comentar com opacidade baixa; ao clicar, modal "Faça login" com botão Entrar → `/auth/login`. Com login, feedback normal.

### Implementação — User Story 3

- [ ] T018 [US3] Atualizar `src/components/blog/like-button.tsx`: quando `isAuthenticated === false`, aplicar `opacity-50` e aparência desativada; ao clicar, abrir ConfirmModal variant `login` em vez de alerta; remover comportamento de alerta
- [ ] T019 [US3] Atualizar `src/components/blog/comment-section.tsx`: quando `isAuthenticated === false`, área de comentário com opacidade baixa; ao tentar enviar ou focar em campo, abrir ConfirmModal variant `login` em vez de alerta; remover comportamento de alerta
- [ ] T020 [P] [US3] Aplicar refinamentos visuais em `src/app/blog/page.tsx` (cards, tipografia, espaçamento) mantendo legibilidade
- [ ] T021 [P] [US3] Aplicar refinamentos visuais em `src/app/blog/[slug]/page.tsx` (corpo do texto, comentários, hierarquia) mantendo legibilidade

**Checkpoint**: Like e comentar usam modal de login; blog refinado.

---

## Phase 7: User Story 4 — Admin refinado (Priority: P3)

**Goal**: Área admin com refinamentos visuais (formulários, listagem, hierarquia de ações) sem alterar CRUD.

**Independent Test**: Login como admin, acessar `/admin/posts`; criar/editar post; validar refinamentos visuais.

### Implementação — User Story 4

- [ ] T022 [P] [US4] Aplicar refinamentos visuais em `src/app/admin/posts/page.tsx` (listagem, espaçamento, tipografia)
- [ ] T023 [US4] Aplicar refinamentos visuais em formulários em `src/app/admin/posts/new/new-post-form.tsx` e `src/app/admin/posts/[id]/edit/edit-post-form.tsx` (labels, inputs, mensagens de erro, hierarquia de botões primária/secundária/destrutiva)
- [ ] T024 [US4] Integrar ConfirmModal para exclusão de post em `src/app/admin/posts/[id]/edit/edit-post-form.tsx` (variant `delete`) antes de chamar deletePost

**Checkpoint**: Admin com refinamentos visuais; exclusão com modal de confirmação.

---

## Phase 8: User Story 5 — Auth refinado (Priority: P4)

**Goal**: Login e registro com refinamentos visuais; formulários limpos; links com hover/focus.

**Independent Test**: Acessar `/auth/login` e `/auth/register`; submeter válidos/inválidos; validar refinamentos.

### Implementação — User Story 5

- [ ] T025 [P] [US5] Aplicar refinamentos visuais em `src/app/auth/login/login-form.tsx` e `src/app/auth/login/page.tsx`
- [ ] T026 [P] [US5] Aplicar refinamentos visuais em `src/app/auth/register/register-form.tsx` e `src/app/auth/register/page.tsx`; garantir links entre login e registro com hover/focus

**Checkpoint**: Auth com refinamentos visuais.

---

## Phase 9: User Story 7 — Acessibilidade e consistência (Priority: P6)

**Goal**: Contraste, foco visível, `prefers-reduced-motion`; consistência de componentes.

**Independent Test**: Navegar por teclado; ativar prefers-reduced-motion; alternar temas; validar contraste.

### Implementação — User Story 7

- [ ] T027 [P] [US7] Revisar `src/app/globals.css` e componentes para indicadores de foco visíveis (focus-visible, ring)
- [ ] T028 [US7] Garantir que animações em toda a aplicação respeitam `@media (prefers-reduced-motion: reduce)` em `src/app/globals.css`
- [ ] T029 [US7] Validar contraste em tema claro e dark; ajustar tokens se necessário para atender requisitos mínimos

**Checkpoint**: Acessibilidade e consistência mantidas ou melhoradas.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Qualidade e validação final.

- [ ] T030 [P] Executar `pnpm typecheck` e corrigir erros até zero
- [ ] T031 [P] Executar `pnpm lint` e corrigir warnings até zero
- [ ] T032 Executar `pnpm build` e corrigir erros até sucesso
- [ ] T033 Validar smoke tests manuais descritos em `specs/003-blog-redesign/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sem dependências
- **Phase 2 (Foundational)**: Depende de Phase 1 — BLOQUEIA user stories
- **Phase 3 (US6 Referências)**: Depende de Phase 1; pode rodar em paralelo com Phase 2
- **Phase 4 (US2 Navbar)**: Depende de Phase 2 (ConfirmModal)
- **Phase 5 (US1 Landing)**: Depende de Phase 2 (LandingSection, useIntersectionReveal), Phase 3 (referências)
- **Phase 6 (US3 Blog)**: Depende de Phase 2 (ConfirmModal), Phase 4 (Navbar no layout)
- **Phase 7 (US4 Admin)**: Depende de Phase 2 (ConfirmModal), Phase 4
- **Phase 8 (US5 Auth)**: Depende de Phase 4
- **Phase 9 (US7 Acessibilidade)**: Depende de todas as anteriores
- **Phase 10 (Polish)**: Depende de todas as anteriores

### User Story Dependencies

- **US6 (Referências)**: Antes de US1 — orienta layouts e animações
- **US2 (Navbar)**: Após Foundational — urgência P1
- **US1 (Landing)**: Após Foundational + US6
- **US3 (Blog)**: Após Foundational + US2
- **US4 (Admin)**: Após Foundational + US2
- **US5 (Auth)**: Após US2
- **US7 (Acessibilidade)**: Cross-cutting, após demais stories

### Parallel Opportunities

- T003, T004, T006 (Foundational) podem rodar em paralelo
- T020, T021 (US3 blog refinamentos) em paralelo
- T022, T025, T026, T027 (US4, US5, US7) em paralelo onde aplicável
- T030, T031 (typecheck, lint) em paralelo

---

## Implementation Strategy

### MVP First

1. Phase 1: Setup
2. Phase 2: Foundational (ConfirmModal, LandingSection, useIntersectionReveal)
3. Phase 3: US6 (validar referências)
4. Phase 4: US2 (Navbar + Settings) — MVP crítico
5. Phase 5: US1 (Landing layouts)
6. **PARAR e VALIDAR**: Smoke tests da navbar e landing
7. Phases 6–10: Blog, Admin, Auth, Acessibilidade, Polish

### Incremental Delivery

1. Setup + Foundational → base de componentes
2. US6 + US2 → navbar e referências
3. US1 → landing refinada
4. US3 → blog + modal login
5. US4, US5 → admin e auth refinados
6. US7 → acessibilidade
7. Polish → typecheck, lint, build, smoke tests

---

## Notes

- Cada task deve incluir caminho de arquivo explícito
- Commit sugerido após cada phase: `feat(003): phase N — <descrição>`
- Verificar `pnpm typecheck` após cada phase antes de avançar
- Research.md já contém ≥12 referências; T007 valida e complementa se necessário
- Landing terá seções futuras (personalizar layout, como funciona o software); T004, T008 e T017 garantem extensibilidade
