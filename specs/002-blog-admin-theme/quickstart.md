# Quickstart: 002 — Tela Inicial, Admin e Tema

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05

Guia para rodar e testar a feature 002 após a implementação. Pressupõe que a 001 está concluída (banco, migrations, seed).

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker (PostgreSQL) se rodar banco local
- Feature 001 aplicada (schema Prisma, DAL, Server Actions de comentários e likes)

---

## 1. Instalar dependências

```bash
pnpm install
```

---

## 2. Variáveis de ambiente

Além de `DATABASE_URL`, se a auth usar variáveis (ex.: secret para cookie de sessão):

```env
DATABASE_URL="postgresql://alice:alice@localhost:5432/alice_blog_dev"
# Exemplo (ajustar conforme implementação):
# SESSION_SECRET="sua-chave-secreta"
```

---

## 3. Banco e migrations

Se ainda não tiver rodado a 001:

```bash
docker compose up -d
pnpm prisma migrate dev
pnpm prisma db seed
```

Se a 002 adicionar migration (ex.: `passwordHash` em User):

```bash
pnpm prisma migrate dev --name add-user-password
```

---

## 4. Desenvolvimento

```bash
pnpm dev
```

- **Landing**: http://localhost:3000  
  Verificar hero, destaque, categorias, footer, tema (toggle), navbar com scroll suave, botão voltar ao topo.
- **Blog**: http://localhost:3000/blog  
- **Post**: http://localhost:3000/blog/hello-world  
  Verificar: sem login, ao tentar comentar → alerta "Faça login para comentar."; após login, comentar → toast no canto inferior direito e scroll permanece na área de comentários.
- **Login**: http://localhost:3000/login (ou rota definida no plano)

---

## 5. Smoke tests manuais — 002

### Tela inicial
1. Acessar `/` e ver hero, artigos em destaque, categorias.
2. Clicar em tópico na navbar → scroll suave até a seção.
3. Rolar a página → botão "Voltar ao topo" aparece; clicar → volta ao topo com transição suave.
4. Toggle tema light/dark → transição suave; recarregar → tema mantido.

### Autenticação e comentários
5. Sem login, abrir um post e tentar comentar → exibir alerta de login; não permitir envio.
6. Fazer login (ou registro), voltar ao post e enviar comentário → sucesso; toast no **canto inferior direito**; página **permanece na área de comentários** (não salta para o topo).

### Footer e contato
7. Rolar até o footer → ver tópicos e botão/link "Entrar em contato"; clicar → abre mailto ou formulário.

### Admin (se implementado)
8. Login como admin → acessar `/admin/posts` → listar/criar/editar/publicar posts.
9. Sem login ou como leitor → acessar `/admin/posts` → redirecionamento ou acesso negado.

---

## 6. Qualidade

```bash
pnpm typecheck
pnpm lint
pnpm build
```

---

## Referência

- Spec: [spec.md](./spec.md)
- Plan: [plan.md](./plan.md)
- Contratos: [contracts/server-actions.md](./contracts/server-actions.md), [contracts/component-api.md](./contracts/component-api.md)
