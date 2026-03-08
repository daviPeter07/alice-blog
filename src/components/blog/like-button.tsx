'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/actions/likes';
import { ConfirmModal } from '@/components/ui/confirm-modal';
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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(toggleLike, null);

  const count = state?.success ? (state.data?.count ?? initialCount) : initialCount;
  const liked = state?.success ? (state.data?.liked ?? initialLiked) : initialLiked;

  if (!isAuthenticated) {
    return (
      <>
        <button
          type="button"
          onClick={() => setLoginModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-ui text-sm text-muted-foreground opacity-50 hover:opacity-70 transition-opacity"
          aria-label="Faça login para curtir"
        >
          <Heart size={18} aria-hidden />
          <span>{count}</span>
        </button>
        <ConfirmModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
          variant="login"
          title="Faça login para curtir"
          message="Entre na sua conta para curtir este artigo."
        />
      </>
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
