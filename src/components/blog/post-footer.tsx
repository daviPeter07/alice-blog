'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, Share2 } from 'lucide-react';
import { LikeButton } from '@/components/blog/like-button';
import { CommentSection } from '@/components/blog/comment-section';
import type { CommentWithReplies } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface PostFooterProps {
  postId: string;
  postUrl: string;
  initialLikeCount: number;
  initialLiked: boolean;
  initialComments: CommentWithReplies[];
  isAuthenticated?: boolean;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
}

export function PostFooter({
  postId,
  postUrl,
  initialLikeCount,
  initialLiked,
  initialComments,
  isAuthenticated = false,
  currentUser = null,
}: PostFooterProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleCommentClick = useCallback(() => {
    setFormOpen((prev) => !prev);
  }, []);

  const handleShareClick = useCallback(async () => {
    const fullUrl = postUrl.startsWith('http') ? postUrl : `${window.location.origin}${postUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: fullUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(fullUrl);
          setShareCopied(true);
          setTimeout(() => setShareCopied(false), 2000);
        }
      }
    } else {
      await copyToClipboard(fullUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  }, [postUrl]);

  const commentCount = initialComments.filter((c) => !c.parentId).length;

  return (
    <div className="mt-10">
      {/* Linha de ações: Like | Comment | Share */}
      <div className="flex items-center gap-4">
        <LikeButton
          postId={postId}
          initialCount={initialLikeCount}
          initialLiked={initialLiked}
          isAuthenticated={isAuthenticated}
        />
        <button
          type="button"
          onClick={handleCommentClick}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-ui text-sm transition-colors',
            formOpen
              ? 'text-brand-green border-brand-green/50 bg-brand-green/5'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
          )}
          aria-label={formOpen ? 'Fechar formulário de comentário' : 'Comentar'}
        >
          <MessageSquare size={18} aria-hidden />
          <span>{commentCount}</span>
        </button>
        <button
          type="button"
          onClick={handleShareClick}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 font-ui text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          aria-label={shareCopied ? 'Link copiado' : 'Compartilhar'}
        >
          <Share2 size={18} aria-hidden />
          <span className="text-xs">{shareCopied ? 'Copiado!' : 'Compartilhar'}</span>
        </button>
      </div>

      <CommentSection
        postId={postId}
        initialComments={initialComments}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        formOpen={formOpen}
        onFormOpenChange={setFormOpen}
      />
    </div>
  );
}

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
