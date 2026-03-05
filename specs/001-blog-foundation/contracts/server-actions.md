# Server Action Contracts

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05

Contratos das Server Actions expostas pela feature foundation.
Todas as actions retornam `ActionResult<T>` e são tipadas end-to-end.

---

## ActionResult Type (base)

```typescript
// src/lib/types.ts
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

---

## createComment

**Arquivo**: `src/actions/comments.ts`
**Trigger**: `useActionState` no `CommentSection` (formulário de comentário)

### Input (FormData via useActionState)
| Campo        | Tipo     | Validação                    |
|--------------|----------|------------------------------|
| postId       | string   | cuid(), required             |
| parentId     | string?  | cuid(), opcional (reply)     |
| authorName   | string   | min 2, max 100 chars         |
| authorEmail  | string   | email válido                 |
| body         | string   | min 3, max 5000 chars        |

### Output
```typescript
ActionResult<{
  id: string;
  authorName: string;
  body: string;
  createdAt: Date;
  parentId: string | null;
}>
```

### Comportamento
1. Recebe `prevState` e `formData` (assinatura de `useActionState`)
2. Extrai campos com `formData.get()`
3. `createCommentSchema.safeParse()` — retorna `fieldErrors` se inválido
4. `prisma.comment.create()` via DAL (não direto — via função de escrita em `src/actions/`)
5. `revalidateTag("comments:<postId>")` após sucesso
6. Retorna `{ success: true, data: comment }` ou `{ success: false, ... }`

### Exemplo de uso (Client Component)
```typescript
const [state, formAction, isPending] = useActionState(createComment, null);
```

---

## toggleLike

**Arquivo**: `src/actions/likes.ts`
**Trigger**: onClick no `LikeButton` via `useOptimistic` + `startTransition`

### Input (FormData)
| Campo  | Tipo   | Validação       |
|--------|--------|-----------------|
| postId | string | cuid(), required|

### Output
```typescript
ActionResult<{
  liked: boolean;   // true = like adicionado, false = like removido
  totalLikes: number;
}>
```

### Comportamento
1. Lê `fingerprint` do cookie `alice_fp` via `cookies()`
2. Se cookie ausente: gera UUID v4, seta cookie (SameSite=Lax, Max-Age=1 ano)
3. `toggleLikeSchema.safeParse({ postId })` — retorna erro se inválido
4. `prisma.like.findUnique({ where: { postId_fingerprint: { postId, fingerprint } } })`
5. Se existe → `prisma.like.delete()` (unlike) | Se não existe → `prisma.like.create()` (like)
6. `revalidateTag("likes:<postId>")` após mutação
7. Conta total de likes com `prisma.like.count({ where: { postId } })`
8. Retorna estado final e total

---

## DAL Functions (read-only, não são actions)

### getPostBySlug

**Arquivo**: `src/data-access/posts.ts`
**Cache tag**: `post:<slug>` + `comments:<post.id>` + `likes:<post.id>`

```typescript
// Signature
export const getPostBySlug = async (slug: string): Promise<PostWithRelations | null>

// PostWithRelations
type PostWithRelations = Post & {
  author: Pick<User, "name" | "image">;
  comments: CommentWithReplies[];
  _count: { likes: number };
};

type CommentWithReplies = Comment & {
  replies: Comment[];
};
```

### getRecentPosts

**Arquivo**: `src/data-access/posts.ts`
**Cache tag**: `posts:list`

```typescript
export const getRecentPosts = async (limit?: number): Promise<PostSummary[]>

type PostSummary = Pick<Post, "slug" | "title" | "excerpt" | "publishedAt" | "tags" | "readingTime"> & {
  author: Pick<User, "name" | "image">;
  _count: { likes: number; comments: number };
};
```
