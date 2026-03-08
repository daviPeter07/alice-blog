# Feature Specification: Redesign Visual — Blog Alice

**Feature Branch**: `003-blog-redesign`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Comece a nova spec 003 que vai ser o re-design — refinamento visual de todo o blog, layouts variados na landing, navbar nova, animações e referências. Preparar componentes para extensibilidade da feature 004 (acessibilidade)."

### Prioridade de referências

A **prioridade central** desta feature é a pesquisa de sites de landing page como referência, focando em:

1. **Layout** — como as seções são dispostas (esquerda/direita, alternância, hierarquia)
2. **Animações** — aparição de texto, transições entre seções, microinterações
3. **Paleta de cores** — marrom escuro, verde escuro, branco e dark mode (equivalente aos tokens `brand-brown`, `brand-green`, `cloud-dancer` e tema dark)

Os layouts, animações e uso de cores da landing devem ser guiados por essa análise de referências antes da implementação.

---

## Clarifications

### Session 2026-03-07

- Q: Escopo — 003 vs feature futura (tempo de leitura, split de artigo, navbar sidebar)? → A: 003 foca em navbar nova, layouts variados, animações e referências; preparar extensibilidade. Tempo de leitura, split e sidebar em feature futura (004). Componentes devem estar prontos para a acessibilidade da 004.
- Q: Padrão de layouts na landing — alternado, fixo por seção ou outro? → A: Variação por categoria de seção (hero sempre X, destaque sempre Y, categorias sempre Z etc.). A definição de layout por tipo de seção depende da análise dos sites de inspiração, que informam: paleta de cores, animações e layouts de seções.
- Q: "Entre ou Cadastre-se" — um link ou dois? → A: Dois links separados: "Entre" → login, "Cadastre-se" → registro. Estilo: "Entre" e "Cadastre-se" em bold; "ou" sem bold (texto: **Entre** ou **Cadastre-se**).
- Q: Navbar quando usuário está logado — o que exibir? → A: Ícone person + nome + dropdown (perfil/configurações, sair). Dropdown inclui link para nova página de configuração e botão de logout. Criar modal reutilizável de confirmação (logout, exclusão de post/comentário, aviso de login). Curtir e comentar: quando não logado, botões com opacidade baixa/aparentam desativados; ao clicar → modal redirecionando para login (remover estados atuais que exibem necessidade de login).

---

## User Scenarios & Testing *(mandatory)*

Esta feature combina **redesign visual** com **nova navbar** e **preparação para extensibilidade**. O foco é: layouts variados na landing (textos à esquerda/direita, não tudo centralizado), navbar redesenhada (hamburger responsivo, logo à esquerda, itens centrais, "Seja bem-vindo"/"Entre ou Cadastre-se" à direita com ícone de person e toggle de tema), animações de aparição de texto e pesquisa de referências (≥10 sites com design atraente e paleta similar). Os componentes (navbar, layout de leitura etc.) devem estar preparados para a feature 004 de acessibilidade (sidebar configurável, paleta, layout de leitura, split de artigo, tempo de leitura — fora do escopo desta spec).

### User Story 1 — Visitante percebe landing com layouts variados e refinados (Priority: P1)

Um visitante acessa a raiz do site (`/`). A landing page mantém funcionalidades (hero, destaque, categorias, navbar, voltar ao topo) mas apresenta **layouts variados por seção** (informações à esquerda em algumas, à direita em outras; não tudo centralizado), inspirados em referências de blogs com design atraente. Inclui animações de aparição de texto, hierarquia tipográfica mais clara, espaçamentos harmoniosos, paleta consistente com os tokens existentes e microinterações em hover/focus. **A landing terá mais seções no futuro**, como: personalizar o layout à vontade, como funciona o software, e outras conforme necessário; a estrutura e o componente `LandingSection` devem suportar extensão sem refatoração.

**Why this priority**: A landing é a primeira impressão; layouts variados e animações elevam a percepção de qualidade.

**Independent Test**: Acessar `/`, verificar layouts alternados (esq/dir), animações de texto, referências visuais aplicadas; validar hierarquia, contraste e responsividade.

**Acceptance Scenarios**:

1. **Given** um visitante na raiz do site, **When** ele acessa `/`, **Then** cada categoria de seção (hero, destaque, categorias) tem layout fixo próprio (ex.: hero esq/dir, destaque dir/esq) definido pela análise dos sites de referência (paleta, animações, layouts).
2. **Given** a landing, **When** o visitante rola a página, **Then** textos e seções têm animações de aparição suaves e respeitam `prefers-reduced-motion`.
3. **Given** a landing, **When** o visitante interage com links e botões, **Then** há feedback visual claro (hover, focus) e transições suaves.
4. **Given** a landing em diferentes larguras de tela, **When** o visitante redimensiona, **Then** o layout permanece legível em mobile, tablet e desktop.
5. **Given** a landing, **When** o visitante usa tema claro e tema escuro, **Then** ambos apresentam refinamentos consistentes.

---

### User Story 2 — Navbar redesenhada e preparada para extensibilidade (Priority: P1)

Um visitante ou usuário acessa qualquer página. A navbar é **redesenhada** com: logo à esquerda; itens de navegação (âncoras da landing e outras seções) ao centro; à direita: toggle de tema; quando **não logado**: ícone person + "Seja bem-vindo" + **Entre** ou **Cadastre-se** (dois links); quando **logado**: ícone person + nome + dropdown com link para página de configuração e botão Sair. Em viewports responsivas, exibe **menu hamburger** em vez da barra completa. A estrutura da navbar deve estar **pronta para extensibilidade** da feature 004 (acessibilidade), permitindo futura configuração de sidebar à esquerda ou direita, sem refatoração estrutural.

**Why this priority**: A navbar é interface crítica; urgência citada pelo usuário.

**Independent Test**: Acessar qualquer página, verificar layout da navbar; em mobile, abrir hamburger; clicar em "Entre ou Cadastre-se" e verificar redirecionamento para login.

**Acceptance Scenarios**:

1. **Given** qualquer página, **When** o visitante visualiza a navbar, **Then** logo está à esquerda, itens de navegação ao centro, e toggle de tema + ícone person + "Seja bem-vindo" + "Entre ou Cadastre-se" à direita.
2. **Given** viewport responsiva (ex.: &lt;768px), **When** o visitante acessa, **Then** a navbar exibe menu hamburger; ao abrir, itens e ações são acessíveis.
3. **Given** o visitante clica em "Entre" ou "Cadastre-se", **When** a ação é acionada, **Then** "Entre" leva a `/auth/login` e "Cadastre-se" a `/auth/register`. Quando logado, **Then** ícone person + nome + dropdown (configurações, sair).
4. **Given** a navbar, **When** planejamento da 004, **Then** a estrutura permite extensão para sidebar configurável sem reescrita estrutural.
5. **Given** um usuário logado, **When** abre o dropdown do person, **Then** vê link para página de configuração e botão Sair (logout abre modal de confirmação).

---

### User Story 3 — Leitor experimenta páginas de blog mais agradáveis (Priority: P2)

Um visitante acessa a listagem de posts (`/blog`) ou a página de um post (`/blog/[slug]`). O conteúdo e funcionalidades permanecem idênticos, mas a apresentação visual é refinada: melhor legibilidade do corpo do texto, espaçamento adequado entre blocos, cards e badges mais polidos, seção de comentários com hierarquia visual mais clara e botões/ações com estados visuais bem definidos.

**Why this priority**: Leitura e interação são o núcleo do blog; refinamentos aqui aumentam conforto e engajamento.

**Independent Test**: Acessar `/blog` e `/blog/[slug]`, comparar visualmente; validar legibilidade, contraste e consistência com a landing.

**Acceptance Scenarios**:

1. **Given** a página de listagem de posts, **When** o visitante visualiza os cards, **Then** há refinamentos visuais (tipografia, espaçamento, hover) sem perda de informação ou funcionalidade.
2. **Given** a página de um post, **When** o visitante lê o conteúdo, **Then** o corpo do texto oferece boa legibilidade (tamanho, linha, contraste).
3. **Given** a seção de comentários, **When** o visitante interage (formulário, replies, avatar), **Then** a hierarquia visual é clara e os estados de foco/hover são visíveis.
4. **Given** botões de like e comentar, **When** o visitante **não está logado**, **Then** os botões têm opacidade baixa e parecem desativados; ao clicar, abre modal que redireciona para login (remover estados atuais que exibem necessidade de login).
5. **Given** botões de like e ações, **When** o visitante **está logado**, **Then** há feedback visual imediato e consistente.

---

### User Story 4 — Admin percebe área administrativa mais profissional (Priority: P3)

Um administrador acessa a área restrita (`/admin/posts` e subpáginas). A funcionalidade de CRUD e publicação permanece inalterada, mas a interface é refinada: formulários mais claros, tabelas/listas mais legíveis, botões e ações com hierarquia visual definida e consistência com o restante do blog.

**Why this priority**: A área admin transmite profissionalismo; refinamentos reforçam a qualidade do produto.

**Independent Test**: Login como admin, acessar `/admin/posts`, criar/editar post; validar consistência visual e usabilidade.

**Acceptance Scenarios**:

1. **Given** a lista de posts admin, **When** o admin visualiza a tabela/listagem, **Then** há refinamentos visuais (espaçamento, tipografia) sem alteração de dados ou ações.
2. **Given** formulários de criação/edição de post, **When** o admin preenche campos, **Then** labels, inputs e mensagens de erro têm hierarquia visual clara.
3. **Given** botões de publicar, despublicar e remover, **When** o admin visualiza, **Then** a hierarquia de ações (primária, secundária, destrutiva) é evidente.

---

### User Story 5 — Usuário encontra telas de auth mais acolhedoras (Priority: P4)

Um visitante acessa as páginas de login (`/auth/login`) e registro (`/auth/register`). A autenticação e validação permanecem idênticas, mas a apresentação é refinada: formulários mais limpos, mensagens de erro mais visíveis, links e botões com feedback visual adequado e alinhamento com a identidade visual do blog.

**Why this priority**: Login e registro são pontos de entrada críticos; refinamentos reduzem fricção percebida.

**Independent Test**: Acessar `/auth/login` e `/auth/register`, submeter formulários válidos e inválidos; validar consistência visual.

**Acceptance Scenarios**:

1. **Given** a página de login ou registro, **When** o visitante visualiza, **Then** o formulário apresenta refinamentos visuais e identidade consistente com o blog.
2. **Given** campos com erro de validação, **When** o usuário submete, **Then** as mensagens de erro são claramente visíveis e associadas aos campos corretos.
3. **Given** links entre login e registro, **When** o visitante interage, **Then** há feedback visual de hover/focus e navegação clara.

---

### User Story 6 — Referências de design e preparação para 004 (Priority: P5)

**Prioridade central da feature.** A implementação deve ser guiada por pesquisa de **≥10 sites de landing page** como referência, focando em: **layout** (disposição de seções, esquerda/direita), **animações** (aparição de texto, transições) e **paleta** (marrom escuro, verde escuro, branco e dark mode — equivalentes a `brand-brown`, `brand-green`, `cloud-dancer` e tema dark). A apresentação da landing deve seguir padrões identificados nesses exemplos antes de implementar. Os componentes (navbar, layout de leitura) devem estar estruturados para a feature 004 de acessibilidade.

**Why this priority**: Garante qualidade visual baseada em referências e facilita a 004.

**Independent Test**: Documentar referências usadas; validar que componentes permitem extensão para sidebar/layout configurável.

**Acceptance Scenarios**:

1. **Given** o planejamento, **When** o redesign é implementado, **Then** há documentação de ≥10 sites de referência com design atraente e paleta similar.
2. **Given** os componentes navbar e layout de leitura, **When** a feature 004 for planejada, **Then** não é necessária refatoração estrutural para sidebar ou layout configurável.

---

### User Story 7 — Todos os usuários se beneficiam de acessibilidade e consistência (Priority: P6)

Em todas as páginas, o redesign mantém ou melhora acessibilidade: contraste adequado em ambos os temas, indicadores de foco visíveis para navegação por teclado, respeito a `prefers-reduced-motion` (redução ou desativação de animações quando o usuário preferir) e consistência de padrões visuais (cores, espaçamentos, componentes) em todo o site.

**Why this priority**: Acessibilidade e consistência são requisitos de qualidade; não devem regredir com o redesign.

**Independent Test**: Navegar por teclado, ativar preferência de movimento reduzido, alternar temas; validar contraste e foco.

**Acceptance Scenarios**:

1. **Given** qualquer página, **When** o usuário navega por teclado, **Then** o foco é sempre visível em elementos interativos.
2. **Given** o sistema do usuário com preferência de movimento reduzido, **When** ele acessa o site, **Then** animações são reduzidas ou desativadas conforme a preferência.
3. **Given** tema claro e tema escuro, **When** o usuário visualiza textos e fundos, **Then** o contraste atende requisitos mínimos de legibilidade.
4. **Given** componentes reutilizáveis (botões, badges, inputs), **When** aparecem em diferentes páginas, **Then** a aparência é consistente.

---

### Edge Cases

- Páginas vazias (ex.: nenhum post publicado): o redesign deve manter estados vazios legíveis e acolhedores.
- Conteúdo longo (post extenso, muitos comentários): refinamentos não devem prejudicar desempenho percebido ou scroll.
- Usuários com preferência de contraste alto: o sistema deve continuar legível; ajustes de cor não podem reduzir contraste abaixo do aceitável.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE aplicar layouts variados na landing (`/`): cada categoria de seção (hero, destaque, categorias) tem layout próprio (texto à esquerda ou direita) definido pela análise dos sites de referência (paleta de cores, animações, layouts de seções).
- **FR-002**: O sistema DEVE incluir animações de aparição de texto na landing e demais páginas, respeitando `prefers-reduced-motion`.
- **FR-003**: O sistema DEVE redesenhar a navbar: logo à esquerda; itens ao centro; à direita: toggle de tema; quando não logado: ícone person + "Seja bem-vindo" + **Entre** ou **Cadastre-se** (dois links); quando logado: ícone person + nome + dropdown (configurações, sair).
- **FR-004**: O sistema DEVE exibir menu hamburger na navbar em viewports responsivas (&lt;768px ou breakpoint definido).
- **FR-005**: O sistema DEVE estruturar navbar e layout de leitura para extensibilidade da feature 004 (sidebar configurável, layout de leitura, split de artigo, tempo de leitura — fora do escopo desta spec).
- **FR-006**: O sistema DEVE documentar ≥10 sites de landing page como referência (prioridade central), focando em: **layout** (disposição de seções), **animações** e **paleta** (marrom escuro, verde escuro, branco e dark mode). A análise deve orientar layouts por categoria (hero, destaque, categorias) e animações antes da implementação.
- **FR-007**: O sistema DEVE aplicar refinamentos visuais nas páginas de blog (`/blog`, `/blog/[slug]`) mantendo legibilidade e usabilidade.
- **FR-008**: O sistema DEVE aplicar refinamentos visuais na área admin e auth mantendo ações e fluxos existentes.
- **FR-009**: O sistema DEVE manter ou melhorar contraste e indicadores de foco para navegação por teclado; respeitar `prefers-reduced-motion`.
- **FR-010**: O sistema DEVE criar modal reutilizável de confirmação para: logout, exclusão de post/comentário e aviso de login (redirecionamento para login quando visitante tenta curtir ou comentar sem estar logado).
- **FR-011**: O sistema DEVE criar página de configuração do usuário (link no dropdown da navbar; conteúdo mínimo na 003, extensível na 004).
- **FR-012**: O sistema DEVE, quando visitante não está logado, exibir botões de curtir e comentar com opacidade baixa/aparentando desativados; ao clicar, abrir modal que redireciona para login (substituir comportamento atual de alerta/estados explícitos).
- **FR-013**: O sistema NÃO DEVE implementar na 003: tempo de leitura, split de artigo em páginas, sidebar configurável — esses itens pertencem à feature 004.

### Key Entities

Nenhuma entidade de dados nova. O redesign atua sobre entidades já existentes (Post, User, Comment, Like) apenas na camada de apresentação.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante identifica visualmente que a landing foi refinada (pesquisa qualitativa ou comparação antes/depois) sem perda de funcionalidade.
- **SC-002**: A legibilidade do corpo de texto em posts permanece ou melhora (tamanho, contraste, espaçamento) em ambos os temas.
- **SC-003**: 100% dos elementos interativos possuem indicador de foco visível ao navegar por teclado.
- **SC-004**: Usuários com `prefers-reduced-motion` não experimentam animações intrusivas ou não necessárias.
- **SC-005**: O layout permanece funcional e equilibrado em viewports de 320px a 1920px de largura.
- **SC-006**: Nenhuma regressão funcional nos cenários de aceitação das features 001 e 002.

---

## Assumptions

- **Prioridade**: A pesquisa de referências (layout, animação, paleta marrom escuro/verde escuro/branco/dark) antecede e orienta a implementação.
- O redesign utiliza o sistema de design e tokens existentes (variáveis CSS, temas) como base; extensões são permitidas para refinamento.
- Não há mudança de identidade de marca (nome, conceito); apenas refinamento da apresentação atual.
- Testes de acessibilidade podem ser manuais ou com ferramentas assistivas; testes automatizados de contraste/foco são opcionais conforme recursos.
- O footer e o header seguem os mesmos critérios de refinamento das demais seções.
- A landing terá **mais seções futuras** (ex.: personalizar layout à vontade, como funciona o software); o `LandingSection` e a navbar devem ser extensíveis para incluir âncoras dessas novas seções.

---

## Implementation Session Notes (2026-03-05)

### Refinamentos Implementados (Landing, Blog, Footer, BackToTop)

**Paleta e tipografia**
- Paleta café aplicada em `globals.css`: `cafe-cream`, `cafe-latte`, `cafe-mocha` (marrom claro → escuro); background `#ebe4dc`, card `#f0eae2`.
- Fontes: Nunito (body), Nunito Sans (UI), Bricolage Grotesque (títulos) via `next/font/google`.
- Títulos usam `font-heading` (Bricolage Grotesque); corpo usa `font-body` (Nunito).

**Hero**
- Componente `TypewriterText` (`src/components/blog/typewriter-text.tsx`): animação de digitação com loop em 3 frases: "Um espaço para ideias.", "Um espaço para reflexões.", "Um espaço para histórias."
- Texto em 2 linhas (`whitespace-pre`), espaço predefinido para evitar layout shift.
- Botão "Ler os artigos" destacado: `bg-brand-green`, `text-white`, sombra.
- Grid hero: coluna texto `520px`, gap `gap-12 md:gap-20 lg:gap-28` entre texto e imagem.
- Bug fix: texto não aparece renderizado antes da animação (displayed vazio até `started`).

**Scroll reveal**
- `useIntersectionReveal`: `threshold` 0.12, `rootMargin` -8% (dispara mais cedo no mobile).
- Animação mais lenta: 0.85s, stagger 100ms; direções variadas: `reveal-from-left`, `reveal-from-right` (keyframes `fade-left`, `fade-right`).
- Seções Featured, Categories, Personalizar, Como funciona: elementos alternam direções.
- PostCard: índice par `reveal-from-left`, ímpar `reveal-from-right`.

**Landing layout**
- Seções Temas, Personalizar, Como funciona adicionadas; `LandingSection` com variantes `featured`, `categories`, `categories-alt`, `footer`.
- Coluna texto hero: `minmax(0, 520px)`; variação de cores entre seções (cafe-latte, cafe-mocha).

**Footer**
- Redesign inspirado em Davi Peterson: brand + Links Rápidos + Contato; copyright "Feito com ♥ e ☕ por Davi Peterson · © [ano] Alice" com ícones Lucide (Heart, Coffee).
- Fundo `cafe-mocha` (light) / `muted/30` (dark); fontes `text-base` (links/descrição), `text-sm` (copyright).
- Link Davi Peterson: `https://davi-peterson.vercel.app/` com underline.

**BackToTop**
- Tema light: `bg-brand-brown`, `text-white`, seta branca.
- Tema dark: `bg-white`, `text-black`, seta preta.
- Ícones: `[&_svg]:text-current`, `stroke-[2.5px]`.

**PostCard**
- Rodapé em 2 linhas (autor em cima; data, tempo de leitura, curtidas, comentários embaixo).
- Tempo de leitura em `src/helpers/reading-time.ts` (~1000 chars/min).
- Ordenação destaque: `orderBy: [{ likes: { _count: 'desc' } }, { publishedAt: 'desc' }]`.

### Próximo foco
- Rota `/admin/posts`: refinamentos visuais (User Story 4) aplicados; smoke tests pendentes.

---

## Dependencies

- **Feature 001 (Blog Foundation)**: Base funcional do blog.
- **Feature 002 (Tela Inicial, Admin e Tema)**: Landing, tema light/dark, auth, admin e footer já implementados. O redesign atua sobre essas implementações.
- **Feature 004 (Acessibilidade e Personalização)** — planejada: tempo de leitura, split de artigo, sidebar configurável, paleta configurável, layout de leitura configurável. A 003 prepara componentes para extensão sem refatoração estrutural.
