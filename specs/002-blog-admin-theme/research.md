# Research: 002 — Tela Inicial, Admin e Tema

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05

Decisões técnicas para tema, autenticação e layout da landing.

---

## 1. Tema light/dark com animação

**Decision**: Aplicar tema via atributo `data-theme` (ou classe) no elemento `<html>`; variáveis CSS no `globals.css` para cores light/dark; transição suave com `transition` em `background-color` e `color` (≈ 200–300ms).

**Rationale**: Mantém o design system em CSS variables (Constitution V); evita flash brusco; não exige lib externa pesada. A preferência é salva em `localStorage` (ex.: chave `alice-theme`) e lida no cliente por um Provider/hook que atualiza `<html>`.

**Alternatives considered**: next-themes (mais dependência); apenas media `prefers-color-scheme` sem persistência (não atende “preferência persistida”).

---

## 2. Autenticação mínima (login para interações)

**Decision**: Sessão via cookie (session token ou identificador de usuário) após login com email e senha. Senha armazenada com hash (ex.: bcrypt) no banco. Comentários e likes exigem `userId` na sessão; se ausente, Server Action retorna erro tipado (ex.: `login_required`) e o cliente exibe alerta/modal e redireciona para `/login`.

**Rationale**: Atende “interações exigem login” e “nome, email, senha” sem OAuth nesta feature. Cookie httpOnly para o token mantém segurança básica.

**Alternatives considered**: NextAuth.js (pode ser adotado depois); apenas cookie com userId em claro (menos seguro, não recomendado).

---

## 3. Alerta ao comentar sem login

**Decision**: Na seção de comentários, se o usuário não estiver autenticado: ao focar no formulário de comentário ou ao clicar em “Enviar”, exibir mensagem clara (alerta inline ou toast informativo): “Faça login para comentar.” e link/botão para `/login`. Não permitir envio; não exibir campos nome/e-mail para comentário anônimo — o usuário deve logar primeiro e então comentar com identidade já preenchida (nome do User).

**Rationale**: Evita que o visitante preencha nome e e-mail a cada interação; deixa explícito que interação exige login.

---

## 4. Toast no canto inferior direito e scroll na área de comentários

**Decision**: (1) Configurar Sonner no `layout.tsx` com `position="bottom-right"`. (2) Após envio de comentário com sucesso: não disparar navegação que cause scroll para o topo; opcionalmente usar `scrollIntoView` na seção de comentários ou no novo comentário (com `behavior: 'smooth'`) para manter o foco visual na área de comentários.

**Rationale**: Toast em posição fixa e consistente; preservar contexto do usuário (comentários) após postar.

---

## 5. Layout da landing (referência Rocketseat)

**Decision**: Estrutura inspirada no blog da Rocketseat: hero/CTA no topo; seção “Artigos em destaque”; seção “Explore categorias” (tags do Post); footer com tópicos e contato. Cores e tipografia seguem tokens do projeto; novas cores para variação da landing adicionadas em `globals.css` no mesmo sistema de tema.

**Rationale**: Atende “apresentação profissional” e “variação de cores” sem copiar literalmente; mantém design system único da Alice.

---

## 6. Footer e contato

**Decision**: Footer com links para seções (âncoras) ou páginas (Blog, Sobre); botão/link “Entrar em contato” que abre `mailto:alice@...` (email da Alice). Formulário de contato que envia email pode ser escopo de tarefa separada (Server Action + serviço de email).

**Rationale**: Simplicidade para MVP; mailto garante contato sem backend de email obrigatório na primeira entrega.
