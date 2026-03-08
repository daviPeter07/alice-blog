'use client';

import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import type { CommentWithReplies } from '@/lib/types';
import { useCommentSection, useToastOnSuccess } from '@/hooks';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { CommentForm } from '@/components/blog/comment-form';
import { CommentItem } from '@/components/blog/comment-item';

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
  isAuthenticated?: boolean;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
  formOpen?: boolean;
  onFormOpenChange?: (open: boolean) => void;
}

export function CommentSection({
  postId,
  initialComments,
  isAuthenticated = true,
  currentUser = null,
  formOpen = false,
}: CommentSectionProps) {
  const {
    mainForm,
    state,
    isPending,
    optimisticComments,
    replyingToId,
    setReplyingToId,
    onMainSubmit,
    handleReplySubmit,
  } = useCommentSection({ postId, initialComments, currentUser });

  const body = useWatch({ control: mainForm.control, name: 'body', defaultValue: '' });
  const canSubmitMain = String(body ?? '').trim() !== '';

  useToastOnSuccess(state, 'Comentário enviado com sucesso! Obrigado pela participação.');

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const topLevel = optimisticComments.filter((c) => !c.parentId);

  const handleReplyClick = (commentId: string | null) => {
    setReplyingToId(commentId);
  };

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
        {topLevel.length === 0
          ? 'Comentários'
          : `${topLevel.length} comentário${topLevel.length > 1 ? 's' : ''}`}
      </h2>

      {formOpen && (
        <CommentForm
          mainForm={mainForm}
          onSubmit={onMainSubmit}
          isPending={isPending}
          canSubmit={canSubmitMain}
          state={state}
          isAuthenticated={!!isAuthenticated}
          onLoginClick={() => setLoginModalOpen(true)}
        />
      )}

      {topLevel.length > 0 && (
        <ul className="flex flex-col gap-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={optimisticComments}
              postId={postId}
              replyingToId={replyingToId}
              onReplyClick={handleReplyClick}
              onReplySubmit={handleReplySubmit}
              isPending={isPending}
              state={state}
              currentUser={currentUser}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </ul>
      )}

      {!isAuthenticated && (
        <ConfirmModal
          open={loginModalOpen}
          onOpenChange={setLoginModalOpen}
          variant="login"
          title="Faça login para comentar"
          message="Entre na sua conta para deixar um comentário."
        />
      )}
    </section>
  );
}
