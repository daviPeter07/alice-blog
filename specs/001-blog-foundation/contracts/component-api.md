# Component API Contracts

**Branch**: `001-blog-foundation` | **Date**: 2026-03-05

Contratos de props dos componentes públicos desta feature.

---

## UI Atoms (`src/components/ui/`)

### Button

```typescript
// src/components/ui/button.tsx
export type ButtonVariant = "primary" | "ghost" | "outline";
export type ButtonSize    = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant; // default: "primary"
  size?: ButtonSize;       // default: "md"
  isLoading?: boolean;     // mostra spinner, desabilita interação
}

export function Button(props: ButtonProps): JSX.Element;
```

### Badge

```typescript
// src/components/ui/badge.tsx
export type BadgeVariant = "default" | "muted";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant; // default: "default"
}

export function Badge(props: BadgeProps): JSX.Element;
```

---

## Blog Organisms (`src/components/blog/`)

### PostCard

```typescript
// src/components/blog/post-card.tsx
export interface PostCardProps {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: Date | null;
  tags: string[];
  readingTime: number | null;
  author: { name: string; image: string | null };
  likesCount: number;
  commentsCount: number;
}

export function PostCard(props: PostCardProps): JSX.Element;
```

### CommentSection

```typescript
// src/components/blog/comment-section.tsx
// "use client" — usa useActionState e useOptimistic

export interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
}

export function CommentSection(props: CommentSectionProps): JSX.Element;
```

### LikeButton

```typescript
// src/components/blog/like-button.tsx
// "use client" — usa useOptimistic e startTransition

export interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean; // derivado do fingerprint cookie no Server Component pai
}

export function LikeButton(props: LikeButtonProps): JSX.Element;
```

---

## Page Contract

### `/blog/[slug]/page.tsx`

```typescript
// src/app/blog/[slug]/page.tsx — Server Component

// Props injetadas pelo Next.js App Router
interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fluxo:
// 1. Valida params.slug com postSlugParamsSchema (Zod)
// 2. Chama getPostBySlug(slug) — "use cache" na DAL
// 3. Se null → notFound()
// 4. Se status DRAFT → notFound()
// 5. Lê cookie alice_fp para derivar initialLiked
// 6. Renderiza layout de post com CommentSection + LikeButton como Client Components
```
