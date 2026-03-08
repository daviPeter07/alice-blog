'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/actions/likes';
import { cn } from '@/lib/utils';

export interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  isAuthenticated?: boolean;
}

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  isAuthenticated = true,
}: LikeButtonProps) {
  const [state, formAction, isPending] = useActionState(toggleLike, null);

  const count = state?.success ? (state.data?.count ?? initialCount) : initialCount;
  const liked = state?.success ? (state.data?.liked ?? initialLiked) : initialLiked;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => window.alert('Faça login para curtir.')}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-ui text-sm text-muted-foreground hover:bg-accent transition-colors"
        >
          <Heart size={18} aria-hidden />
          <span>{count}</span>
        </button>
        <span className="font-ui text-xs text-muted-foreground">
          Faça{' '}
          <Link href="/auth/login" className="text-brand-green underline">
            login
          </Link>{' '}
          para curtir.
        </span>
      </div>
    );
  }

  return (
    <form action={formAction} className="inline-block">
      <input type="hidden" name="postId" value={postId} />
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-ui text-sm transition-colors',
          liked
            ? 'text-destructive hover:bg-destructive/10'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} aria-hidden />
        <span>{count}</span>
      </button>
    </form>
  );
}
