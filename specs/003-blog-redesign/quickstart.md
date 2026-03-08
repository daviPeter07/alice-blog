# Quickstart: 003 — Redesign Visual

**Branch**: `003-blog-redesign` | **Date**: 2026-03-07

Guia para rodar e testar a feature 003 após a implementação. Pressupõe que 001 e 002 estão concluídas.

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker (PostgreSQL) se rodar banco local
- Features 001 e 002 aplicadas (banco, migrations, seed, auth, tema, admin)

---

## 1. Instalar dependências

```bash
pnpm install
```

---

## 2. Variáveis de ambiente

Usar o mesmo `.env` da 002 (DATABASE_URL, SESSION_SECRET, SEED_*). Ver `.env.example`.

---

## 3. Desenvolvimento

```bash
pnpm dev
```

- **Landing**: http://localhost:3000  
  Verificar layouts variados por seção (hero, destaque, categorias); animações de aparição; paleta marrom/verde/branco; dark mode.
- **Navbar**: Logo esq, itens centro, tema + person dir; "Entre | Cadastre-se" (dois links); hamburger em viewport &lt;768px.
- **Blog**: http://localhost:3000/blog  
- **Post**: http://localhost:3000/blog/hello-world  
  Verificar: sem login, botões curtir/comentar com opacidade baixa; ao clicar → modal redirecionando para login (não alerta).
- **Settings**: http://localhost:3000/settings  
  Rota protegida; conteúdo mínimo; link no dropdown quando logado.
- **Login/Registro**: http://localhost:3000/auth/login, http://localhost:3000/auth/register

---

## 4. Smoke tests manuais — 003

### Referências e prioridade
0. **Antes de implementar**: Ler `research.md`; documentar ≥10 referências; layouts/cores/animações orientados pela pesquisa.

### Landing e layouts
1. Acessar `/` e ver layouts variados (hero esq/dir, destaque dir/esq, etc.) conforme `research.md`.
2. Rolar a página → animações de aparição suaves; respeitar `prefers-reduced-motion` (ativar no SO e verificar).
3. Toggle tema light/dark → refinamentos consistentes; paleta marrom escuro, verde escuro, branco/dark mode.

### Navbar
4. Logo à esquerda, itens de navegação ao centro, toggle de tema + person à direita.
5. Sem login: "Seja bem-vindo" + **Entre** ou **Cadastre-se** (dois links); "Entre" e "Cadastre-se" em bold.
6. Clicar "Entre" → `/auth/login`; "Cadastre-se" → `/auth/register`.
7. Com login: ícone person + nome + dropdown; "Configurações" → `/settings`, "Sair" → modal de confirmação.
8. Viewport &lt;768px: menu hamburger; ao abrir, itens e ações acessíveis.

### Modal e botões desativados
9. Sem login, em um post: curtir e comentar com opacidade baixa; ao clicar → modal "Faça login" com botão "Entrar" → redireciona para login.
10. Logout: ao clicar "Sair" no dropdown → modal de confirmação; confirmar → logout.

### Extensibilidade e consistência
11. Navegar por teclado → foco visível em elementos interativos.
12. Contraste adequado em ambos os temas.
13. `pnpm typecheck`, `pnpm lint`, `pnpm build` passam sem erros.

---

## 5. Qualidade

```bash
pnpm typecheck
pnpm lint
pnpm build
```

---

## Referência

- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Research: [research.md](./research.md)
- Data Model: [data-model.md](./data-model.md)
- Contratos: [contracts/component-api.md](./contracts/component-api.md)
