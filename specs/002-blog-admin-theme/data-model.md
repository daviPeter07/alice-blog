# Data Model: 002 — Tela Inicial, Admin e Tema

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05
**Source**: spec.md (User com nome, email, senha; avatar por iniciais) + 001 data-model + research.md

---

## Alterações em relação à 001

A feature 002 introduz **autenticação** para interações (comentar, like). Os artigos permanecem públicos. O modelo de dados da 001 é mantido; as extensões abaixo são opcionais ou recomendadas conforme a estratégia de auth escolhida.

### User (extensão para auth)

- **passwordHash** (ou **password**): campo opcional no Prisma para armazenar hash da senha (ex.: bcrypt). Se a autenticação for apenas por cookie/session com usuário fixo (Alice) nesta feature, o campo pode ser adicionado em migration posterior.
- **image**: permanece opcional; na 002 **não é usado** — avatar é sempre iniciais + cor (helper existente).
- **role**: READER | ADMIN — já existe; usado para proteger rotas `/admin`.

### Comment (vinculação ao User, opcional na 002)

- Na 001, Comment usa `authorName` e `authorEmail` (visitante anônimo). Na 002, **comentários exigem login**; pode-se:
  - **Opção A**: Manter `authorName` e `authorEmail` em Comment e preencher a partir do User logado na Server Action (redundante mas simples).
  - **Opção B**: Adicionar `userId` opcional em Comment e passar a preencher a partir da sessão; exibir nome do User e avatar por iniciais.

Recomendação para MVP 002: **Opção A** — na action `createComment`, obter nome e email do User da sessão e gravar em `authorName`/`authorEmail`; não exibir formulário de nome/email quando logado. Assim não é obrigatória migration no Comment.

### Like (vinculação ao User, opcional na 002)

- Na 001, Like usa `fingerprint` (cookie anônimo). Na 002, **like exige login**; pode-se:
  - Manter `fingerprint` e associar ao userId em sessão (um like por User por post), ou
  - Adicionar `userId` em Like e usar `@@unique([postId, userId])` em vez de fingerprint.

Recomendação para MVP 002: manter fingerprint para compatibilidade com dados existentes; na action `toggleLike`, exigir sessão e opcionalmente gravar userId em Like em migration futura. Por agora: **exigir sessão** para chamar toggleLike; fingerprint continua identificando o “dispositivo” e o userId pode ser usado para validar “está logado”.

### Sessão

- Não é obrigatório modelar tabela `Session` no Prisma se a sessão for apenas cookie (token JWT ou id de usuário) validado em memória ou via lib (ex.: NextAuth). Se usar NextAuth com adapter Prisma, a tabela Session será criada pelo adapter.
- Para auth mínima caseira: cookie `alice_session` com valor assinado (userId + expiry); verificação em middleware ou em Server Action.

---

## Resumo de entidades (sem mudança obrigatória no schema 001)

| Entidade | Mudança na 002 |
|----------|-----------------|
| User     | Adicionar `passwordHash` (String?) se auth com senha no DB; resto igual. |
| Post     | Sem mudança. |
| Comment  | Sem mudança no schema; preenchimento de authorName/authorEmail a partir do User na action. |
| Like     | Sem mudança no schema; action exige sessão. |
| Session  | Opcional: tabela Session se usar NextAuth/Prisma adapter; caso contrário, sessão em cookie. |

---

## Migrations sugeridas (quando implementar auth com senha)

```prisma
// Exemplo de migração para User com senha (quando for implementar)
model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String?  @map("password_hash")  // novo
  image        String?
  role         Role     @default(READER)
  createdAt    DateTime @default(now()) @map("created_at")

  posts    Post[]
  comments Comment[]  // se adicionar userId em Comment no futuro

  @@map("users")
}
```

---

## Zod schemas (auth)

### auth.schema.ts (novo)

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "Senha obrigatória."),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").max(100, "Nome deve ter no máximo 100 caracteres."),
  email: z.string().email("E-mail inválido."),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

---

## Referência ao data-model da 001

Para entidades completas (Post, Comment, Like, User base), ver `specs/001-blog-foundation/data-model.md`. Este documento descreve apenas **extensões e uso** na 002.
