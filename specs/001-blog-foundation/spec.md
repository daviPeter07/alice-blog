# Feature Specification: Blog Foundation — Estrutura Base

**Feature Branch**: `001-blog-foundation`
**Created**: 2026-03-05
**Status**: Draft
**Input**: User description: "Criar a estrutura base do projeto Alice Blog — blog moderno inspirado em Medium/Substack/Rocketseat com infraestrutura fundacional completa."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Leitor acessa um post pelo slug (Priority: P1)

Um visitante digita ou clica em um link do tipo `/blog/meu-primeiro-post`.
O sistema exibe o conteúdo completo do post: título, autor, data de publicação,
corpo do artigo e a seção de comentários com os comentários já existentes.

**Why this priority**: É o fluxo central do blog — sem ele, nenhum conteúdo é
acessível. Todos os outros user stories dependem de um post ser exibido.

**Independent Test**: Pode ser testado de forma isolada inserindo um post de
seed no banco e acessando `/blog/<slug>`. Se a página renderizar o título e
o corpo corretamente, esta story está completa.

**Acceptance Scenarios**:

1. **Given** um post com `status: PUBLISHED` e `slug: "hello-world"` existe no
   banco, **When** o visitante acessa `/blog/hello-world`, **Then** a página
   exibe o título, o nome do autor, a data e o corpo do post.
2. **Given** um slug inexistente, **When** o visitante acessa `/blog/nao-existe`,
   **Then** o sistema retorna uma página 404 com mensagem amigável.
3. **Given** um post com `status: DRAFT`, **When** qualquer visitante acessa
   seu slug, **Then** o sistema retorna 404 (rascunhos não são públicos).

---

### User Story 2 — Leitor comenta em um post (Priority: P2)

Um visitante preenche o formulário de comentário (nome, e-mail, mensagem)
na página de um post e submete. O comentário aparece imediatamente na tela
(feedback optimista) e é persistido no banco.

**Why this priority**: Comentários são a principal forma de interação social
do blog e diferenciam o produto de um site estático.

**Independent Test**: Pode ser testado submetendo o formulário de comentário
em qualquer post de seed. Se o comentário aparecer na lista sem recarregar
a página e persistir após reload, a story está completa.

**Acceptance Scenarios**:

1. **Given** o formulário de comentário preenchido com dados válidos, **When**
   o visitante clica em "Enviar", **Then** o comentário aparece no final da
   lista imediatamente (optimistic update) e é salvo no banco.
2. **Given** o formulário com campos obrigatórios vazios ou e-mail inválido,
   **When** o visitante clica em "Enviar", **Then** o sistema exibe mensagens
   de erro inline sem limpar os outros campos.
3. **Given** um comentário existente, **When** o visitante clica em "Responder",
   **Then** um sub-formulário de reply é exibido e o reply é salvo com
   `parentId` apontando para o comentário pai.

---

### User Story 3 — Leitor reage com Like em um post (Priority: P3)

Um visitante clica no botão de Like de um post. O contador incrementa
imediatamente (feedback optimista). A ação é idempotente: clicar novamente
remove o like do mesmo visitante.

**Why this priority**: Engajamento passivo (likes) é secundário à leitura e
aos comentários, mas complementa a experiência social do blog.

**Independent Test**: Pode ser testado clicando no botão de Like em qualquer
post. Se o contador mudar imediatamente e persistir após reload, a story
está completa.

**Acceptance Scenarios**:

1. **Given** um visitante sem like registrado no post, **When** ele clica em
   "Like", **Then** o contador incrementa em +1 imediatamente e o like é
   persistido.
2. **Given** um visitante que já deu like no post (mesmo `fingerprint`),
   **When** ele clica em "Like" novamente, **Then** o like é removido e o
   contador decrementa em -1.
3. **Given** múltiplos visitantes simultâneos, **When** todos clicam em Like,
   **Then** cada fingerprint único conta uma única vez — sem duplicatas.

---

### Edge Cases

- O que acontece quando o banco de dados está indisponível ao carregar um post?
  O sistema deve exibir uma mensagem de erro genérica, nunca expor detalhes
  internos.
- O que acontece se o corpo de um comentário exceder o limite razoável de
  caracteres (ex: 5.000 chars)? O sistema deve rejeitar na validação com
  mensagem clara.
- O que acontece se o `fingerprint` de Like não puder ser gerado (cookies
  bloqueados)? O sistema deve permitir o like com fallback, sem bloquear a
  interação.
- O que acontece ao acessar `/blog/[slug]` sem o slug na URL? Next.js retorna
  404 pelo próprio roteamento.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir a página de um post publicado acessando
  `/blog/[slug]`, com título, autor, data, corpo e seção de comentários.
- **FR-002**: O sistema DEVE retornar 404 para slugs inexistentes ou posts
  com `status: DRAFT`.
- **FR-003**: O visitante DEVE conseguir submeter um comentário com nome,
  e-mail e mensagem; o comentário deve aparecer na lista sem recarregar a
  página.
- **FR-004**: O sistema DEVE validar todos os campos do formulário de
  comentário antes de persistir; campos inválidos devem exibir erros inline.
- **FR-005**: O visitante DEVE conseguir responder a um comentário existente,
  criando um reply aninhado.
- **FR-006**: O visitante DEVE conseguir dar e remover Like de um post de
  forma idempotente, identificado por fingerprint anônimo.
- **FR-007**: O sistema DEVE refletir likes e comentários otimisticamente na
  UI antes da confirmação do servidor.
- **FR-008**: O sistema DEVE invalidar o cache de um post após um comentário
  ou like ser adicionado/removido.
- **FR-009**: O sistema DEVE aplicar a paleta de marca definida
  (`--brand-brown`, `--brand-green`, `--cloud-dancer`, `--black`) de forma
  consistente em todos os componentes.
- **FR-010**: O sistema DEVE carregar fontes sem dependência de requisições
  externas em runtime.

### Key Entities

- **Post**: Artigo publicável com identificador único de URL (slug), conteúdo,
  metadados de autoria e estado de publicação (rascunho / publicado).
- **Comment**: Reação textual de um visitante a um post, com suporte a
  hierarquia de respostas (reply a outro comentário).
- **Like**: Reação positiva anônima e idempotente de um visitante a um post.
- **User**: Identidade do autor/administrador com papel (admin ou leitor).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante consegue acessar a página de um post e ler seu
  conteúdo completo em menos de 2 segundos em conexão padrão.
- **SC-002**: Um visitante consegue submeter um comentário e ver o resultado
  na tela em menos de 500ms (contando o optimistic update local).
- **SC-003**: O sistema rejeita 100% dos comentários com campos obrigatórios
  ausentes ou e-mail em formato inválido antes de qualquer persistência.
- **SC-004**: A ação de Like é idempotente: executar a mesma ação duas vezes
  pelo mesmo visitante resulta no estado inicial (0 likes adicionados).
- **SC-005**: O sistema exibe uma página de erro amigável para slugs
  inexistentes, sem expor detalhes de implementação.
- **SC-006**: 100% dos componentes visuais utilizam exclusivamente os tokens
  de cor definidos na paleta da marca, sem valores hexadecimais hardcoded.
- **SC-007**: O projeto compila e passa em verificação de tipos sem nenhum
  erro no modo estrito de TypeScript.

---

## Assumptions

- O banco de dados usado no desenvolvimento é PostgreSQL local ou SQLite
  (detalhes definidos no `/speckit.plan`).
- O `fingerprint` de Like é gerado a partir de um cookie anônimo ou User-Agent
  + IP hash — a estratégia exata é resolvida no planejamento técnico.
- A moderação de comentários (aprovação manual antes de exibir) está
  mapeada no modelo de dados (`approved: Boolean`) mas **não** é
  implementada nesta feature foundation — é deferred para uma feature futura.
- O conteúdo dos posts será seed manual (SQL/Prisma seed) nesta fase; nenhum
  painel de administração é entregue nesta feature.
- Autenticação de autor/admin é mapeada no modelo (`User`) mas não implementada
  nesta feature — deferred.
