# Quickstart: Blog Foundation

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05

Guia para rodar o projeto localmente do zero após a implementação desta feature.

---

## Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker Desktop (para PostgreSQL local)

---

## 1. Instalar dependências

```bash
pnpm install
```

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env` com os valores locais:

```env
DATABASE_URL="postgresql://alice:alice@localhost:5432/alice_blog_dev"
```

---

## 3. Subir o banco de dados

Crie um arquivo `docker-compose.yml` na raiz do projeto (o arquivo não é versionado por padrão; use `docker-compose.example.yml` como referência se existir) com um serviço PostgreSQL na porta 5432. Exemplo:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: alice
      POSTGRES_PASSWORD: alice
      POSTGRES_DB: alice_blog_dev
    ports:
      - "5432:5432"
```

Depois execute:

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL em `localhost:5432` com:
- usuário: `alice`
- senha: `alice`
- database: `alice_blog_dev`

---

## 4. Rodar as migrations

```bash
pnpm prisma migrate dev --name init
```

---

## 5. Popular o banco com dados de seed

```bash
pnpm prisma db seed
```

Isso cria:
- 1 usuário admin (`alice@aliceblog.dev`)
- 1 post publicado (`/blog/hello-world`)
- 1 comentário de exemplo

---

## 6. Rodar o servidor de desenvolvimento

```bash
pnpm dev
```

Acesse `http://localhost:3000/blog/hello-world` para verificar US1.

---

## 7. Verificar qualidade

```bash
pnpm typecheck   # zero erros TypeScript
pnpm lint        # zero warnings ESLint
pnpm build       # build de produção deve passar
```

---

## Smoke Tests Manuais

### US1 — Leitura de Post
1. Acesse `http://localhost:3000/blog/hello-world`
2. ✅ Título, autor, data e corpo do post são exibidos
3. Acesse `http://localhost:3000/blog/nao-existe`
4. ✅ Página 404 é exibida

### US2 — Comentários
1. Na página do post, preencha o formulário de comentário com dados válidos
2. Clique em "Enviar"
3. ✅ Comentário aparece na lista imediatamente (optimistic)
4. Recarregue a página
5. ✅ Comentário persiste
6. Tente enviar com campos vazios
7. ✅ Erros inline são exibidos, sem recarregar a página

### US3 — Likes
1. Na página do post, clique no botão "Like"
2. ✅ Contador incrementa imediatamente
3. Recarregue a página
4. ✅ Like persiste e contador mantém o valor
5. Clique em "Like" novamente
6. ✅ Like é removido (toggle idempotente)

---

## Estrutura de Arquivos Criados por Esta Feature

```
src/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   └── blog/[slug]/page.tsx
├── actions/
│   ├── comments.ts
│   └── likes.ts
├── data-access/
│   ├── posts.ts
│   └── comments.ts
├── components/
│   ├── ui/button.tsx
│   ├── ui/badge.tsx
│   ├── blog/post-card.tsx
│   ├── blog/comment-section.tsx
│   └── blog/like-button.tsx
└── lib/
    ├── prisma.ts
    ├── types.ts
    └── schemas/
        ├── comment.schema.ts
        ├── like.schema.ts
        └── post.schema.ts
prisma/
├── schema.prisma
└── seed.ts
docker-compose.yml
.env.example
```
