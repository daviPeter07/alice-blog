# Feature Specification: Tela Inicial, Admin e Tema — Blog Alice

**Feature Branch**: `002-blog-admin-theme`
**Created**: 2026-03-05
**Status**: Draft
**Input**: User description: "Tela inicial baseada no blog da Rocketseat; toggle tema light/dark com animação suave; autenticação para interações (artigos públicos); usuário com nome, email, senha e avatar por iniciais; apresentação profissional com destaque, categorias, variação de cores; footer com tópicos e contato por email; animações, transições na navbar e botão voltar ao topo."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitante vê a tela inicial inspirada no blog Rocketseat (Priority: P1)

Um visitante acessa a raiz do site (`/`). O sistema exibe uma landing page profissional inspirada no [blog da Rocketseat](https://www.rocketseat.com.br/blog): seção de destaque (hero/CTA), artigos em destaque, exploração de categorias de artigos, variação de cores ao longo da página, animações leves e botão para login. A navegação (navbar) inclui tópicos que, ao clicar, levam o usuário à seção correspondente com transição suave (scroll animado). Um botão "Voltar ao topo" aparece quando o usuário rola a página.

**Why this priority**: A home é a primeira impressão do blog e deve transmitir profissionalismo; é o ponto de partida para leitores e para login.

**Independent Test**: Acessar `/`, verificar hero/destaque, artigos em destaque, categorias, footer com tópicos e contato, animações e transições, e botão voltar ao topo após scroll.

**Acceptance Scenarios**:

1. **Given** um visitante na raiz do site, **When** ele acessa `/`, **Then** a página exibe uma tela inicial com seção de destaque, artigos em destaque e área de categorias de artigos, com variação de cores e visual profissional.
2. **Given** a tela inicial, **When** o visitante clica em um tópico na navbar, **Then** a página faz uma transição suave (scroll) até a seção correspondente na mesma página.
3. **Given** o visitante rola a página para baixo, **When** ele passa de um limite definido, **Then** um botão "Voltar ao topo" é exibido e, ao clicar, a página retorna ao topo com transição suave.
4. **Given** a tela inicial, **When** há posts publicados, **Then** artigos em destaque e/ou recentes são exibidos; quando não houver posts, um estado vazio adequado é mostrado sem quebrar o layout.
5. **Given** a tela inicial, **When** o visitante visualiza a página, **Then** animações leves (ex.: entrada de seções, hover) estão presentes e não prejudicam acessibilidade nem performance.

---

### User Story 2 — Visitante e usuário alternam tema light/dark com animação (Priority: P2)

Um visitante ou usuário logado pode alternar entre tema claro (light) e tema escuro (dark). A mudança de tema deve ter uma **animação leve** (transição suave de cores/opacidade), e a preferência é persistida (cookie ou armazenamento local) e aplicada em todas as páginas.

**Why this priority**: Conforto de leitura, acessibilidade e polish; a animação diferencia a experiência.

**Independent Test**: Clicar no toggle de tema, observar a transição animada para light/dark, recarregar e verificar que a preferência foi mantida.

**Acceptance Scenarios**:

1. **Given** qualquer página do blog, **When** o usuário ativa o tema escuro, **Then** a interface passa ao tema dark com uma transição suave (animação leve), sem “flash” brusco.
2. **Given** tema escuro ativo, **When** o usuário ativa o tema claro, **Then** a interface volta ao tema light com a mesma transição suave.
3. **Given** uma preferência de tema escolhida, **When** o usuário recarrega ou navega, **Then** o mesmo tema permanece aplicado.
4. **Given** um visitante que nunca escolheu tema, **When** ele acessa o site, **Then** o sistema usa preferência do sistema operacional (se disponível) ou tema padrão definido.

---

### User Story 3 — Interações exigem login; usuário com nome, email, senha e avatar por iniciais (Priority: P3)

Os artigos permanecem **públicos** (qualquer um pode ler). Toda **interação** (comentar, dar like, responder comentário) exige que o usuário esteja autenticado. O usuário possui nome, email e senha; **não há foto de perfil** — o avatar é um ícone com a **primeira letra do nome** (ou iniciais) e uma cor derivada do nome, de forma consistente com o que já existe na seção de comentários.

**Why this priority**: Define o modelo de autenticação e identidade visual do usuário em todo o blog; mantém leitura aberta e interação protegida.

**Independent Test**: Sem login, tentar comentar ou dar like e ser direcionado ao login; após cadastro/login, comentar e ver avatar por iniciais com cor.

**Acceptance Scenarios**:

1. **Given** um visitante não autenticado, **When** ele tenta comentar ou dar like em um post, **Then** o sistema exibe um **alerta** (ou mensagem clara) informando que é necessário fazer login para interagir, e **não** permite preencher nome/e-mail para enviar — o usuário deve logar primeiro, evitando preencher dados a cada interação.
2. **Given** um usuário que se registra ou faz login, **When** ele informa nome, email e senha, **Then** o sistema valida e cria/autentica a conta; o usuário passa a poder interagir (comentar, like).
3. **Given** um usuário autenticado que comenta ou aparece em listas de autores, **When** a interface exibe sua identidade, **Then** é mostrado um avatar com iniciais (ex.: primeira letra ou duas primeiras letras do nome) e uma cor estável gerada a partir do nome, sem foto de perfil.
4. **Given** artigos publicados, **When** qualquer pessoa (autenticada ou não) acessa a página do post, **Then** o conteúdo do artigo é visível; apenas as ações de interação exigem login.

---

### User Story 4 — Footer com tópicos e contato com a Alice por email (Priority: P4)

A landing page e as páginas relevantes possuem um **footer** com tópicos (links ou seções) e um botão/link para **entrar em contato com a Alice**. O site é voltado para a Alice como autora; o contato é feito **por email** (ex.: link `mailto:` ou formulário que envia email).

**Why this priority**: Profissionalismo e canal claro de contato para a dona do blog.

**Independent Test**: Rolar até o footer, ver tópicos e botão de contato; clicar em contato e ver abertura de email ou envio de mensagem.

**Acceptance Scenarios**:

1. **Given** qualquer página que tenha footer, **When** o visitante rola até o rodapé, **Then** vê tópicos (ex.: links úteis, categorias, sobre) e um botão ou link "Entrar em contato" (ou equivalente).
2. **Given** o visitante clica em "Entrar em contato", **When** a ação é acionada, **Then** o sistema abre o cliente de email com o endereço da Alice ou envia a mensagem por canal de email definido (ex.: formulário que dispara email).
3. **Given** o footer, **When** o visitante navega pelos tópicos, **Then** os links levam às seções ou páginas corretas (âncoras na home ou rotas específicas).

---

### User Story 5 — Admin cria, edita e publica posts (Priority: P5)

Um administrador autenticado (Alice) acessa uma área restrita (ex.: `/admin` ou `/admin/posts`), onde pode listar, criar, editar, publicar/despublicar e remover posts. Apenas usuários com papel de administrador acessam essa área.

**Why this priority**: Permite à autora publicar conteúdo sem depender de seed manual.

**Independent Test**: Login como admin, acessar área de posts, criar rascunho, publicar e ver o post na listagem pública.

**Acceptance Scenarios**:

1. **Given** um admin autenticado, **When** ele acessa a área de administração de posts, **Then** vê lista de posts e pode criar, editar, publicar/despublicar e remover.
2. **Given** um post em rascunho, **When** o admin publica, **Then** o post aparece na listagem pública e na home (destaque/categorias conforme regras).
3. **Given** um visitante não admin, **When** ele tenta acessar a área de administração de posts, **Then** o sistema redireciona ou exibe acesso negado.

---

### User Story 6 — Correção de pequenos bugs da foundation (Priority: P6)

Bugs conhecidos da feature 001 são corrigidos (ex.: formulário de comentário exibindo erros ao carregar, botão enviar desabilitado indevidamente, erros de reply no formulário principal), sem regressões.

**Why this priority**: Estabilidade da base antes de expandir.

**Independent Test**: Reproduzir cenários de bug da 001 e verificar comportamento correto.

**Acceptance Scenarios**:

1. **Given** os cenários de aceitação da 001, **When** o usuário interage com formulários e fluxos de comentários/likes, **Then** não há regressões e os bugs conhecidos estão corrigidos.
2. **Given** um usuário autenticado que envia um comentário com sucesso, **When** o sistema exibe confirmação, **Then** o **toast de sucesso** aparece no **canto inferior direito** da tela.
3. **Given** um usuário que acaba de enviar um comentário, **When** a ação é concluída, **Then** a página **mantém o scroll na área de comentários** (não salta para o topo); a vista permanece na seção de comentários.

---

### Edge Cases

- Admin perde sessão durante edição: salvar rascunho quando possível; ao reautenticar, permitir continuar ou exibir mensagem clara.
- Preferência de tema em outro dispositivo: cada dispositivo pode ter sua própria preferência; sincronização não é obrigatória nesta feature.
- Nenhum post publicado na home: exibir estado vazio adequado, sem quebrar layout.
- Acesso a rota admin sem autenticação: redirecionamento para login ou página de acesso negado.
- Usuário tenta interagir (comentar/like) sem login: redirecionamento ou prompt para login antes de concluir a ação.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir na raiz (`/`) uma tela inicial profissional inspirada no blog da Rocketseat, com seção de destaque (hero/CTA), artigos em destaque e categorias de artigos, com variação de cores ao longo da página.
- **FR-002**: O sistema DEVE permitir variação de cores na tela inicial; novas cores podem ser adicionadas ao sistema de design (ex.: `globals.css`) conforme necessário para a landing.
- **FR-003**: O sistema DEVE oferecer alternância entre tema claro (light) e tema escuro (dark) com **transição animada suave** (animação leve) em todas as páginas.
- **FR-004**: O sistema DEVE persistir a preferência de tema (cookie ou armazenamento local) e reaplicá-la em visitas e navegação subsequentes.
- **FR-005**: A navbar DEVE incluir tópicos que, ao clicar, levam à seção correspondente na página com **transição suave** (scroll animado).
- **FR-006**: O sistema DEVE exibir um botão "Voltar ao topo" quando o usuário rolar além de um limite; ao clicar, a página deve voltar ao topo com transição suave.
- **FR-007**: O sistema DEVE incluir animações leves na landing page (ex.: entrada de seções, hover), sem prejudicar acessibilidade nem performance.
- **FR-008**: Os artigos DEVE permanecer públicos (leitura sem login); toda interação (comentar, like, responder) DEVE exigir usuário autenticado.
- **FR-009**: O sistema DEVE permitir registro e login com **nome, email e senha**; usuários não possuem foto de perfil — o avatar DEVE ser um ícone com iniciais (primeira letra ou iniciais do nome) e cor estável derivada do nome, consistente com a exibição na seção de comentários.
- **FR-010**: O sistema DEVE exibir na landing e onde aplicável um **footer** com tópicos (links/seções) e botão ou link para **contato com a Alice por email** (ex.: `mailto:` ou formulário que envia email).
- **FR-011**: O sistema DEVE fornecer área restrita para administradores listar, criar, editar, publicar/despublicar e remover posts; acesso apenas para papel de administrador.
- **FR-012**: O sistema DEVE aplicar os temas light e dark de forma consistente com tokens de cor e variáveis de tema; a transição entre temas deve ser animada.
- **FR-013**: O sistema DEVE corrigir os pequenos bugs identificados na feature 001 (formulários, botões, isolamento de erros), sem regressões.
- **FR-014**: Quando um visitante não autenticado tentar comentar ou dar like, o sistema DEVE exibir um alerta (ou mensagem clara) de que é necessário fazer login para interagir, sem permitir o envio com nome/e-mail anônimo — evitando que o usuário preencha dados a cada interação.
- **FR-015**: O toast de sucesso ao publicar um comentário DEVE ser exibido no **canto inferior direito** da tela para o usuário.
- **FR-016**: Após o envio de um comentário, a página DEVE manter o scroll na **área de comentários** (não saltar para o topo); a vista permanece na seção de comentários.

### Key Entities

- **Post**: Mantido da 001; admin pode criar, editar, publicar/despublicar e remover; exibido em destaque e categorias na home.
- **User**: Nome, email, senha; sem foto; avatar por iniciais + cor; papel READER ou ADMIN; autenticação necessária para interações.
- **Preferência de tema**: light/dark ou seguir sistema; persistida no cliente; transição animada.
- **Contato**: Canal de comunicação com a Alice por email (link ou formulário).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante identifica na home o propósito do blog, vê artigos em destaque e categorias, e acessa a listagem de artigos em até dois cliques.
- **SC-002**: A alternância de tema (light/dark) exibe transição animada suave em 100% das trocas; a preferência persiste após recarregar.
- **SC-003**: Usuário não autenticado não consegue comentar nem dar like; após login com nome/email/senha, consegue interagir e é exibido com avatar de iniciais e cor.
- **SC-004**: O footer está presente nas páginas definidas, com tópicos e opção de contato por email com a Alice.
- **SC-005**: Ao clicar em tópico na navbar, a página realiza scroll suave até a seção correspondente; o botão "Voltar ao topo" aparece após scroll e retorna ao topo com transição suave.
- **SC-006**: A landing page contém animações leves sem impacto negativo em acessibilidade ou performance percebida.
- **SC-007**: Admin autenticado consegue criar, publicar e ver o post na listagem pública; não-admin não acessa a área de administração.
- **SC-008**: Zero regressões nos cenários de aceitação da 001 e bugs conhecidos corrigidos.

---

## Assumptions

- Referência visual ao blog da Rocketseat: estrutura e ideias (destaque, categorias, footer, profissionalismo), não cópia literal; o conteúdo e a marca são da Alice.
- Autenticação pode ser implementada de forma mínima (sessão com email/senha); OAuth/SSO pode ser feature futura.
- Avatar por iniciais reutiliza a lógica já existente na seção de comentários (helper de iniciais e cor por nome).
- Contato por email pode ser `mailto:alice@...` ou formulário que envia para um endereço da Alice; detalhe no planejamento.
- Novas cores para a landing podem ser adicionadas em `globals.css` (ou equivalente) dentro do sistema de design existente.
- A área admin é restrita à Alice (ou usuários com papel ADMIN); a landing e o footer comunicam que o site é da Alice.

---

## Dependencies

- **Feature 001 (Blog Foundation)**: Base de posts, comentários, likes, DAL, design system e helpers (ex.: iniciais, cor de avatar). Correções de bugs referem-se ao comportamento da 001.
