import type { Comment, Post, User } from '@/lib/prisma';

// Discriminated union returned by every Server Action.
// Keeps client-side narrowing type-safe without exposing Zod internals.
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ---------------------------------------------------------------------------
// DAL projection types (mirrors contracts/server-actions.md)
// ---------------------------------------------------------------------------

export type CommentWithReplies = Comment & {
  replies: Comment[];
};

export type PostWithRelations = Post & {
  author: Pick<User, 'name' | 'image'>;
  comments: CommentWithReplies[];
  _count: { likes: number };
};

export type PostSummary = Pick<
  Post,
  'slug' | 'title' | 'excerpt' | 'publishedAt' | 'tags' | 'readingTime'
> & {
  author: Pick<User, 'name' | 'image'>;
  _count: { likes: number; comments: number };
};
