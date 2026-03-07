# Server Action Contracts — 002

**Branch**: `002-blog-admin-theme` | **Date**: 2026-03-05

Contratos das Server Actions da feature 002 e ajustes nas actions da 001.
Todas as actions retornam `ActionResult<T>` e são tipadas end-to-end.

---

## ActionResult Type (base)

```typescript
// src/lib/types.ts (inalterado)
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };
```

Para erros de autorização, usar `error` com código ou mensagem reconhecível pelo cliente (ex.: `"login_required"`).

---

## createComment (ajustes na 002)

**Arquivo**: `src/actions/comments.ts`

### Requisito de autenticação (002)

1. No início da action, obter sessão (ex.: `getSession()` ou cookie).
2. Se **não** houver usuário logado, retornar imediatamente:
   ```typescript
   return { success: false, error: "login_required", data: undefined };
   ```
3. O cliente (CommentSection) deve tratar `state?.error === "login_required"` exibindo **alerta** ou mensagem: "Faça login para comentar." e não permitir envio; não exibir campos nome/e-mail para comentário anônimo — usuário logado terá nome/email preenchidos a partir do User.
4. Quando logado: preencher `authorName` e `authorEmail` a partir do User da sessão (não do FormData do cliente).

### Toast e scroll (comportamento do cliente)

- **Toast**: O Toaster (Sonner) deve estar configurado com `position="bottom-right"` no `layout.tsx` para que o toast de sucesso ao comentar apareça no canto inferior direito.
- **Scroll**: Após sucesso, o cliente **não** deve causar scroll para o topo (evitar navegação ou refresh que remonte a árvore). Opcional: `scrollIntoView` na seção de comentários ou no novo comentário com `behavior: 'smooth'` para manter o foco na área de comentários.

### Input (quando logado)

| Campo    | Tipo    | Origem              |
|----------|---------|---------------------|
| postId   | string  | FormData            |
| parentId | string? | FormData (reply)    |
| body     | string  | FormData            |
| authorName / authorEmail | — | Preenchidos no servidor a partir do User da sessão |

---

## login

**Arquivo**: `src/actions/auth.ts` (novo)

### Input (FormData ou JSON)
| Campo    | Tipo   | Validação     |
|----------|--------|---------------|
| email    | string | email válido  |
| password | string | required      |

### Output
```typescript
ActionResult<{ userId: string; name: string }>
```
Em sucesso: define cookie de sessão e retorna dados mínimos do usuário. Em falha: `success: false`, `error` com mensagem (ex.: "Credenciais inválidas.").

### Comportamento
1. `loginSchema.safeParse()` nos campos.
2. Buscar User por email; verificar senha (hash).
3. Se válido: criar sessão (cookie), retornar `{ success: true, data: { userId, name } }`.
4. Se inválido: retornar `{ success: false, error: "..." }`.

---

## register

**Arquivo**: `src/actions/auth.ts`

### Input
| Campo    | Tipo   | Validação        |
|----------|--------|------------------|
| name     | string | min 2, max 100   |
| email    | string | email válido     |
| password | string | min 8            |

### Output
```typescript
ActionResult<{ userId: string; name: string }>
```
Em sucesso: criar User (com passwordHash), criar sessão, retornar dados. Em falha: `fieldErrors` ou `error`.

---

## logout

**Arquivo**: `src/actions/auth.ts`

### Input
Nenhum (ou FormData vazio).

### Output
```typescript
ActionResult<void>
```
Limpa cookie de sessão e redireciona para home ou login.

---

## toggleLike (ajuste 002)

**Arquivo**: `src/actions/likes.ts`

### Requisito de autenticação (002)

1. Verificar sessão no início.
2. Se não houver usuário logado, retornar:
   ```typescript
   return { success: false, error: "login_required", data: undefined };
   ```
3. O cliente (LikeButton) exibe alerta "Faça login para curtir." e link para login.

---

## Admin: createPost / updatePost / deletePost

**Arquivo**: `src/actions/posts.ts` (novo ou estendido)

- Todas exigem sessão com `role === "ADMIN"`.
- Retornam `ActionResult<Post>` ou `ActionResult<void>` conforme o caso.
- Invalidação: `revalidateTag("posts:list", "max")` e tags do post quando aplicável.

(Detalhes de input/output definidos nas tasks de implementação.)

---

## DAL (referência)

- `getPostBySlug`, `getRecentPosts`, `getCommentsByPostId`: inalterados na assinatura; cache tags conforme 001.
- Novo: `getUserByEmail` (auth) em `src/data-access/users.ts` se auth usar DB para senha.
