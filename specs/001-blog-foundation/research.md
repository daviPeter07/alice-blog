# Research: Blog Foundation

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05

---

## 1. Fingerprint Strategy for Anonymous Likes

**Decision**: Cookie UUID anônimo (`alice_fp`) como fingerprint primário,
com fallback para hash SHA-256 de `User-Agent + IP` quando cookies estão bloqueados.

**Rationale**:
- Cookie é persistente entre sessões no mesmo navegador — comportamento mais
  previsível para o usuário (o like "lembra" quem você é).
- Hash de UA+IP é fallback suficiente para o MVP; não é perfeito
  (IPs compartilhados = colisão) mas aceitável para um blog sem requisito
  de precisão de auditoria.
- Alternativas como device fingerprint (FingerprintJS) adicionam dependência
  externa e custo — rejeitado pelo princípio de simplicidade da constituição.
- A Server Action `toggleLike` lê o fingerprint do cookie via `cookies()` do
  Next.js; se ausente, gera um UUID v4, seta o cookie (httpOnly: false para
  permitir leitura no cliente) e usa o valor gerado.

**Alternatives considered**:
- FingerprintJS Pro — rejeitado (custo + dependência externa).
- Auth obrigatória para Like — rejeitado (friction excessivo para o MVP).
- localStorage — rejeitado (não acessível em Server Actions).

---

## 2. Database de Desenvolvimento

**Decision**: PostgreSQL local via Docker Compose para desenvolvimento, com
suporte a SQLite via `DATABASE_URL` para ambientes sem Docker (ex: CI rápido).

**Rationale**:
- PostgreSQL é o target de produção (Vercel Postgres / Neon) — paridade total
  entre dev e prod evita surpresas com comportamentos SQL-específicos.
- Docker Compose mantém o setup reproduzível sem exigir instalação local.
- Prisma suporta ambos; a troca é apenas na `DATABASE_URL`.
- SQLite não suporta arrays nativos (`tags String[]`) — ao usar SQLite,
  `tags` deve ser armazenado como JSON string. Isso é documentado como
  limitação do ambiente SQLite apenas.

**Alternatives considered**:
- Neon (PostgreSQL serverless) direto no dev — rejeitado (latência de rede
  no dev local degrada a DX).
- PlanetScale (MySQL) — rejeitado (não é PostgreSQL; Prisma schema differences).

---

## 3. Estratégia de Cache com `"use cache"` (Next.js 16)

**Decision**: Usar a diretiva `"use cache"` na camada DAL combinada com
`cacheTag()` por entidade para invalidação granular.

**Rationale**:
- A diretiva `"use cache"` do Next.js 16 é o mecanismo nativo de caching
  para Server Components e funções de servidor — alinha perfeitamente com
  o Princípio IV da constituição.
- Tags por entidade permitem invalidar apenas o cache afetado por uma
  mutação, sem purgar caches de outros posts.
- Convenção de tags: `post:<slug>`, `comments:<postId>`, `likes:<postId>`.
- `revalidateTag("post:<slug>")` é chamado dentro da Server Action após
  mutação bem-sucedida.

**Tag convention defined**:
```
post:<slug>         → cache da função getPostBySlug
posts:list          → cache da lista de posts (home page futura)
comments:<postId>   → cache de getCommentsByPostId
likes:<postId>      → cache de getLikesByPostId
```

**Alternatives considered**:
- `revalidatePath` — rejeitado para invalidação granular (purga toda a rota,
  não apenas o dado específico).
- ISR com `revalidate: N` — rejeitado (stale window inaceitável para
  comentários em tempo quase real).

---

## 4. Estratégia de Tipagem do ActionResult

**Decision**: Union type discriminada `ActionResult<T>`:

```typescript
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

**Rationale**:
- Tipo discriminado permite que o cliente faça narrowing explícito com
  `if (result.success)` — elimina `any` e garante type-safety completo.
- `fieldErrors` é um Record alinhado com a saída do `ZodError.flatten()`
  para mapear erros por campo diretamente no formulário.
- `useActionState` do React 19 tipado com `ActionResult<T>` como estado.

**Alternatives considered**:
- Throw/catch em Server Actions — rejeitado (exceções não tipadas, comportamento
  imprevisível com `useActionState`).
- `{ errors: ZodError }` direto — rejeitado (acopla o cliente ao tipo Zod).

---

## 5. Fonte Tipográfica

**Decision**: `Lora` (serif, para títulos e corpo de post) +
`Inter` (sans-serif, para UI geral) via `next/font/google`.

**Rationale**:
- `Lora` é uma serif elegante e muito legível para leitura longa —
  alinha com o estilo Substack/Medium do target visual.
- `Inter` é a sans-serif mais usada em interfaces de blog modernas
  (usado no Vercel Blog, Linear, Notion) — familiar e neutra.
- `next/font` self-hosta as fontes automaticamente, zero requisições
  externas em runtime (Princípio IV + FR-010).
- CSS variables: `--font-body: var(--font-lora)`,
  `--font-ui: var(--font-inter)` definidas no layout raiz.

**Alternatives considered**:
- Geist (já no projeto como padrão Next.js) — mantida como opção de
  fallback; mas Lora é mais adequada para blog de conteúdo longo.
- System font stack — rejeitado (inconsistência visual entre plataformas
  comprometeria o design system).

---

## 6. Estrutura de Pastas Resolvida

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fontes, metadata)
│   ├── globals.css             # Tailwind v4 @theme + tokens
│   ├── page.tsx                # Home (placeholder por ora)
│   └── blog/
│       └── [slug]/
│           └── page.tsx        # Post page (US1)
├── actions/
│   ├── comments.ts             # createComment (US2)
│   └── likes.ts                # toggleLike (US3)
├── data-access/
│   ├── posts.ts                # getPostBySlug, getRecentPosts
│   └── comments.ts             # getCommentsByPostId
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── badge.tsx
│   └── blog/
│       ├── post-card.tsx
│       ├── comment-section.tsx
│       └── like-button.tsx
└── lib/
    ├── prisma.ts               # Singleton Prisma client
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
