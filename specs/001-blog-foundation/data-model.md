# Data Model: Blog Foundation

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05
**Source**: spec.md (Key Entities) + constitution.md (Princípio VI) + research.md

---

## Prisma Schema Completo

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

enum Role {
  ADMIN
  READER

  @@map("role")
}

enum PostStatus {
  DRAFT
  PUBLISHED

  @@map("post_status")
}

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  image     String?
  role      Role     @default(READER)
  createdAt DateTime @default(now()) @map("created_at")

  posts Post[]

  @@map("users")
}

model Post {
  id          String     @id @default(cuid())
  slug        String     @unique
  title       String
  excerpt     String
  content     String     // MDX ou HTML — processado em runtime
  coverImage  String?    @map("cover_image")
  publishedAt DateTime?  @map("published_at")
  status      PostStatus @default(DRAFT)
  tags        String[]   // Array nativo PostgreSQL
  readingTime Int?       @map("reading_time") // minutos estimados
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  authorId String @map("author_id")
  author   User   @relation(fields: [authorId], references: [id])

  comments Comment[]
  likes    Like[]

  @@index([status, publishedAt(sort: Desc)])
  @@index([slug])
  @@map("posts")
}

model Comment {
  id          String   @id @default(cuid())
  body        String   @db.VarChar(5000)
  authorName  String   @map("author_name")
  authorEmail String   @map("author_email")
  approved    Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")

  postId String @map("post_id")
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

  // Self-relation para threads de reply
  parentId String?   @map("parent_id")
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[] @relation("CommentReplies")

  @@index([postId, createdAt(sort: Asc)])
  @@map("comments")
}

model Like {
  id          String   @id @default(cuid())
  fingerprint String   // cookie UUID ou UA+IP hash
  createdAt   DateTime @default(now()) @map("created_at")

  postId String @map("post_id")
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)

  // Garante idempotência: um fingerprint só pode dar like uma vez por post
  @@unique([postId, fingerprint])
  @@index([postId])
  @@map("likes")
}
```

---

## Entidades & Relacionamentos

### User
| Campo       | Tipo      | Restrição       | Notas                          |
|-------------|-----------|-----------------|--------------------------------|
| id          | String    | PK, cuid()      |                                |
| name        | String    | NOT NULL        |                                |
| email       | String    | UNIQUE          |                                |
| image       | String?   | opcional        | URL do avatar                  |
| role        | Role      | default: READER | ADMIN \| READER                |
| createdAt   | DateTime  | default: now()  |                                |

### Post
| Campo       | Tipo        | Restrição        | Notas                            |
|-------------|-------------|------------------|----------------------------------|
| id          | String      | PK, cuid()       |                                  |
| slug        | String      | UNIQUE           | URL-friendly, imutável após pub. |
| title       | String      | NOT NULL         |                                  |
| excerpt     | String      | NOT NULL         | ≤ 300 chars recomendado          |
| content     | String      | NOT NULL         | MDX ou HTML bruto                |
| coverImage  | String?     | opcional         | URL da imagem de capa            |
| publishedAt | DateTime?   | nullable         | null enquanto DRAFT              |
| status      | PostStatus  | default: DRAFT   | DRAFT \| PUBLISHED               |
| tags        | String[]    | PostgreSQL array | Para filtros futuros             |
| readingTime | Int?        | minutos          | Calculado no seed/create         |
| authorId    | String      | FK → User        |                                  |

### Comment
| Campo       | Tipo     | Restrição       | Notas                             |
|-------------|----------|-----------------|-----------------------------------|
| id          | String   | PK, cuid()      |                                   |
| body        | String   | VarChar(5000)   | Validado pelo Zod schema          |
| authorName  | String   | NOT NULL        | Visitante anônimo                 |
| authorEmail | String   | NOT NULL        | Não exposto publicamente          |
| approved    | Boolean  | default: false  | Moderação futura — não usado agora|
| postId      | String   | FK → Post       | Cascade delete                    |
| parentId    | String?  | FK → Comment    | null = comment raiz               |

**Regra de negócio**: na fase foundation, `approved` é ignorado na query
(todos os comentários são exibidos). A moderação é deferred.

### Like
| Campo       | Tipo     | Restrição              | Notas                        |
|-------------|----------|------------------------|------------------------------|
| id          | String   | PK, cuid()             |                              |
| fingerprint | String   | NOT NULL               | Cookie UUID ou UA+IP hash    |
| postId      | String   | FK → Post              | Cascade delete               |
|             |          | UNIQUE(postId, fp)     | Constraint de idempotência   |

---

## Diagramas de Relacionamento

```
User (1) ──────< Post (N)
Post (1) ──────< Comment (N)
Post (1) ──────< Like (N)
Comment (1) ───< Comment (N)   [self-relation: parentId]
```

---

## State Transitions

### Post.status
```
DRAFT ──[publish]──> PUBLISHED
PUBLISHED ──[unpublish]──> DRAFT   (feature futura)
```

### Like (toggle)
```
[sem like] ──[toggleLike]──> [com like]
[com like] ──[toggleLike]──> [sem like]
```

---

## Indexes & Performance

| Tabela   | Index                              | Motivo                                  |
|----------|------------------------------------|-----------------------------------------|
| posts    | (status, publishedAt DESC)         | Listagem de posts publicados ordenados  |
| posts    | (slug)                             | Lookup por slug em getPostBySlug        |
| comments | (postId, createdAt ASC)            | Listagem cronológica de comentários     |
| likes    | (postId)                           | Count de likes por post                 |
| likes    | UNIQUE (postId, fingerprint)       | Constraint de idempotência              |

---

## Seed de Desenvolvimento

```typescript
// prisma/seed.ts — dados mínimos para testar US1, US2, US3

const author = await prisma.user.create({
  data: {
    name: "Alice",
    email: "alice@aliceblog.dev",
    role: "ADMIN",
  },
});

const post = await prisma.post.create({
  data: {
    slug: "hello-world",
    title: "Hello, World",
    excerpt: "O primeiro post do Alice Blog.",
    content: "# Hello, World\n\nEste é o conteúdo de exemplo.",
    status: "PUBLISHED",
    publishedAt: new Date(),
    tags: ["meta", "introdução"],
    readingTime: 1,
    authorId: author.id,
  },
});

await prisma.comment.create({
  data: {
    body: "Que post incrível!",
    authorName: "Leitor Exemplo",
    authorEmail: "leitor@exemplo.com",
    postId: post.id,
  },
});
```

---

## Zod Schemas (referência)

### comment.schema.ts
```typescript
import { z } from "zod";

export const createCommentSchema = z.object({
  postId:      z.string().cuid(),
  parentId:    z.string().cuid().optional(),
  authorName:  z.string().min(2).max(100),
  authorEmail: z.string().email(),
  body:        z.string().min(3).max(5000),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
```

### like.schema.ts
```typescript
import { z } from "zod";

export const toggleLikeSchema = z.object({
  postId: z.string().cuid(),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
```

### post.schema.ts (params de rota)
```typescript
import { z } from "zod";

export const postSlugParamsSchema = z.object({
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
});

export type PostSlugParams = z.infer<typeof postSlugParamsSchema>;
```
