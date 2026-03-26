# Alice-Blog

Blog de reflexões sobre filosofia, história, crítica social e a condição humana. Por Alice.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Prisma** + **PostgreSQL** — persistência
- **Docker** — PostgreSQL em container (opcional)
- **Tailwind CSS v4** — estilos
- **react-markdown** + **remark-breaks** + **rehype-raw** — Markdown e HTML em posts e comentários
- **next-themes** — tema claro/escuro
- **Radix UI** — componentes base (Dialog, Slot)
- **react-hook-form** + **zod** — formulários

## Pré-requisitos

- Node.js 18+
- pnpm (recomendado)
- PostgreSQL (local ou via Docker)

## Docker

O projeto inclui um `docker-compose.yml` com PostgreSQL 16 para desenvolvimento local:

```bash
# Subir apenas o banco
docker compose up -d postgres
```

- **Imagem:** `postgres:16-alpine`
- **Porta:** `5433` (host) → `5432` (container)
- **Banco:** `alice_blog_dev` | **Usuário:** `alice` | **Senha:** definida no `docker-compose.yml`

Exemplo de `DATABASE_URL` no `.env`:

```
DATABASE_URL="postgresql://alice:SENHA@localhost:5433/alice_blog_dev"
```

Volume nomeado `alice_postgres_data` persiste os dados entre reinícios.

## Como rodar

```bash
# Instalar dependências
pnpm install

# Variáveis de ambiente
cp .env.example .env
# Edite .env com DATABASE_URL e demais variáveis

# Migrar banco
pnpm db:migrate

# Seed (opcional)
pnpm db:seed

# Dev
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Script        | Descrição                              |
|---------------|----------------------------------------|
| `pnpm dev`    | Servidor de desenvolvimento            |
| `pnpm build`  | Build de produção                      |
| `pnpm start`  | Servidor de produção                   |
| `pnpm lint`   | ESLint                                 |
| `pnpm typecheck` | Verificação de tipos TypeScript     |
| `pnpm format` | Prettier (formatar código)             |
| `pnpm db:migrate` | Rodar migrações Prisma             |
| `pnpm db:seed`    | Popular banco com dados iniciais    |
| `pnpm db:studio`  | Abrir Prisma Studio                |
| `pnpm db:reset`   | Resetar banco e rodar migrações    |

## Antes do deploy (testar como na CI)

O ambiente de produção roda o mesmo comando de build. Na máquina local:

```bash
pnpm run build
```

Isso executa `prisma generate` + `next build` (Turbopack) e costuma reproduzir erros como `module not found` ou falhas de TypeScript **antes** de enviar para a plataforma.

Comandos úteis em conjunto:

```bash
pnpm run typecheck   # só TypeScript, mais rápido
pnpm run lint
```

## Deploy

O cliente Prisma é gerado em `src/generated/prisma/` (pasta **ignorada pelo Git**). Sem rodar `prisma generate` antes do build, o Next falha com `Can't resolve '@/generated/prisma/client'`.

- **`postinstall`** — após `pnpm install` / `npm install`, o Prisma gera o client automaticamente.
- **`build`** — inclui `prisma generate && next build` para ambientes que não executam `postinstall`.

Configure `DATABASE_URL` (e `SESSION_SECRET`, etc.) nas variáveis de ambiente da plataforma. Em builds que usam só `dependencies` (sem devDependencies), instale o pacote `prisma` em `dependencies` ou use um comando de build explícito que inclua `prisma generate`.

**Build sem banco acessível:** o projeto evita consultar o Postgres na fase de *collect page data* quando possível (home com categorias em `Suspense`, `generateStaticParams` de posts tolerante a falha, admin com `force-dynamic`). Para **pré-renderizar** slugs de posts no build, o banco precisa estar acessível em `DATABASE_URL` nessa hora; caso contrário as rotas `/blog/[slug]` são geradas na primeira requisição.

**Erro `P1001` / "Can't reach database server":** em desenvolvimento, suba o Postgres (ex.: `docker compose up -d postgres`) antes de `pnpm dev` ou `pnpm build` se quiser dados reais em todas as rotas.

## Estrutura

```
src/
├── app/              # Rotas (App Router)
│   ├── admin/        # Área administrativa (posts)
│   ├── auth/         # Login, registro
│   ├── blog/         # Listagem e posts
│   └── settings/     # Configurações do usuário
├── actions/          # Server Actions
├── components/       # Componentes React
│   ├── admin/        # Formulários e campos admin
│   ├── blog/         # Hero, cards, comentários, etc.
│   ├── layout/       # Navbar, Footer
│   └── ui/           # Componentes base (LoadingDots, Badge, etc.)
├── data-access/      # Acesso a dados (Prisma)
├── helpers/          # Utilitários
├── hooks/            # Hooks customizados
├── lib/              # Auth, schemas, types
└── types/            # Tipos globais

specs/                # Especificações de features
├── 001-blog-foundation/
├── 002-blog-admin-theme/
└── 003-blog-redesign/
```

## O que está implementado

- **Landing** — Hero com animação de digitação, Destaques, Quem sou eu, Categorias, Personalizar, Como funciona; scroll reveal; gatos laterais; BackToTop
- **Blog** — Listagem paginada com filtro por tag, posts com Markdown/HTML, tempo de leitura
- **Comentários** — Formulário, respostas aninhadas, edição (até 5 min), exclusão; Markdown/HTML
- **Curtir** — Like por post (fingerprint)
- **Auth** — Login, registro, sessão por cookie
- **Admin** — CRUD de posts (título, resumo, conteúdo, tags); publicação/rascunho
- **Tema** — Tema claro/escuro (next-themes)
- **Navbar** — Logo, âncoras, toggle tema, dropdown (logado: configurações/sair; não logado: Entre/Cadastre-se); menu hamburger no mobile
- **Configurações** — Página base (feature 004)
- **Loading** — `LoadingDots` padronizado em todos os fallbacks de Suspense

## Roadmap

- **003-blog-redesign** (em andamento) — Refinamento visual, layouts variados na landing, animações, referências de design
- **004-acessibilidade** (planejada) — Sidebar configurável, paleta configurável, layout de leitura configurável, tempo de leitura, split de artigo

## Specs

Especificações em `specs/`. Comandos speckit em `spec-commands.md`.

---

Feito com ♥ e ☕
