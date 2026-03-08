'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { createCommentSchema, type CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult, CommentWithReplies } from '@/lib/types';
import { formatDate, getInitials, avatarHue } from '@/helpers';
import { useCommentSection, useToastOnSuccess, type OptimisticComment } from '@/hooks';
import { AdminCheck } from '@/components/ui/admin-check';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { MarkdownContentField } from '@/components/admin/markdown-content-field';
import { cn } from '@/lib/utils';

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
  onFormOpenChange,
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

      {/* Formulário acima dos comentários — só aparece quando formOpen */}
      {formOpen && (
        <div
          className={cn(
            'rounded-2xl border border-border bg-card px-7 py-6 mb-10',
            !isAuthenticated && 'opacity-50'
          )}
        >
          <h3 className="font-heading text-lg font-semibold text-foreground mb-5">
            Deixe um comentário
          </h3>

          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="w-full rounded-xl border border-border bg-muted/50 px-4 py-6 font-ui text-sm text-foreground hover:bg-muted/70 transition-colors text-left cursor-pointer"
            >
              Para comentar, faça login.
            </button>
          )}

          {isAuthenticated && (
            <>
              {state?.success === false && state.error === 'login_required' && (
                <p className="font-ui text-sm text-destructive mb-4">
                  <Link href="/auth/login" className="underline">
                    Faça login
                  </Link>{' '}
                  para comentar.
                </p>
              )}

              {state?.success === false &&
                !state.fieldErrors &&
                state.error !== 'login_required' && (
                  <p className="font-ui text-sm text-destructive mb-4">{state.error}</p>
                )}

              <form onSubmit={mainForm.handleSubmit(onMainSubmit)} className="space-y-4">
                <div>
                  <Controller
                    control={mainForm.control}
                    name="body"
                    render={({ field }) => (
                      <MarkdownContentField
                        id="body"
                        name="body"
                        value={field.value}
                        onChange={field.onChange}
                        required
                        placeholder="Escreva aqui suas reflexões… (Markdown: **negrito**, *itálico*, listas…)"
                        rows={4}
                      />
                    )}
                  />
                  {mainForm.formState.errors.body && (
                    <p className="mt-1 font-ui text-xs text-destructive">
                      {mainForm.formState.errors.body.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isPending || !canSubmitMain || !isAuthenticated}
                    className="font-ui text-sm font-medium px-5 py-2.5 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
                  >
                    {isPending ? 'Enviando…' : 'Enviar comentário'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Lista de comentários */}
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

/* ------------------------------------------------------------------ */
/* Item de comentário + formulário de reply                              */
/* ------------------------------------------------------------------ */

function CommentItem({
  comment,
  allComments,
  postId,
  replyingToId,
  onReplyClick,
  onReplySubmit,
  isPending,
  state,
  currentUser,
  isAuthenticated = true,
}: {
  comment: OptimisticComment;
  allComments: OptimisticComment[];
  postId: string;
  replyingToId: string | null;
  onReplyClick: (id: string | null) => void;
  onReplySubmit: (parentId: string, data: CreateCommentInput) => void;
  isPending: boolean;
  state: ActionResult | null;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
  isAuthenticated?: boolean;
}) {
  const isAdmin =
    comment.author?.role === 'ADMIN' ||
    (comment.pending &&
      currentUser?.role === 'ADMIN' &&
      comment.authorEmail === currentUser?.email);
  const persistedReplies = comment.replies ?? [];
  const optimisticReplyIds = new Set(persistedReplies.map((r) => r.id));
  const fromOptimistic = allComments.filter(
    (c) => c.parentId === comment.id && !optimisticReplyIds.has(c.id)
  );
  const replies: OptimisticComment[] = [...persistedReplies, ...fromOptimistic]
    .map((r) => ({ ...r, replies: (r as OptimisticComment).replies ?? [] }))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const hue = avatarHue(comment.authorName);
  const isReplying = replyingToId === comment.id;

  return (
    <li className={`flex gap-4 animate-fade-in ${comment.pending ? 'opacity-50' : ''}`}>
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-ui font-semibold select-none mt-0.5"
        style={{ background: `oklch(0.55 0.12 ${hue})` }}
        aria-hidden
      >
        {getInitials(comment.authorName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="font-ui text-sm font-semibold text-foreground">
            {comment.authorName}
          </span>
          {isAdmin && <AdminCheck size={14} />}
          {!comment.pending && (
            <time className="font-ui text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </time>
          )}
          {comment.pending && (
            <span className="font-ui text-xs text-muted-foreground italic">enviando…</span>
          )}
        </div>

        <div className="font-ui text-sm text-foreground/85 leading-relaxed prose prose-sm prose-alice max-w-none">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>{comment.body}</ReactMarkdown>
        </div>

        {!comment.parentId && isAuthenticated && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onReplyClick(isReplying ? null : comment.id)}
              className="font-ui text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Responder
            </button>
          </div>
        )}

        {isReplying && (
          <ReplyForm
            postId={postId}
            parentId={comment.id}
            parentAuthorName={comment.authorName}
            onSubmit={onReplySubmit}
            onCancel={() => onReplyClick(null)}
            isPending={isPending}
            state={state}
            currentUser={currentUser}
          />
        )}

        {replies.length > 0 && (
          <ul className="mt-4 pl-4 border-l border-border flex flex-col gap-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                postId={postId}
                replyingToId={replyingToId}
                onReplyClick={onReplyClick}
                onReplySubmit={onReplySubmit}
                isPending={isPending}
                state={state}
                currentUser={currentUser}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Formulário de resposta — aparece embaixo do comentário               */
/* ------------------------------------------------------------------ */

function ReplyForm({
  postId,
  parentId,
  parentAuthorName,
  onSubmit,
  onCancel,
  isPending,
  state,
  currentUser,
}: {
  postId: string;
  parentId: string;
  parentAuthorName: string;
  onSubmit: (parentId: string, data: CreateCommentInput) => void;
  onCancel: () => void;
  isPending: boolean;
  state: ActionResult | null;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
}) {
  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    mode: 'onChange',
    defaultValues: {
      postId,
      parentId,
      authorName: currentUser?.name ?? '',
      authorEmail: currentUser?.email ?? '',
      body: '',
    },
  });

  const replyBody = useWatch({ control: form.control, name: 'body', defaultValue: '' });
  const canSubmitReply = String(replyBody ?? '').trim() !== '';

  useEffect(() => {
    if (state?.success === false && state.fieldErrors) {
      (Object.entries(state.fieldErrors) as [keyof CreateCommentInput, string[]][]).forEach(
        ([field, messages]) => {
          form.setError(field, { message: messages?.[0] });
        }
      );
    }
  }, [state, form]);

  const handleSubmit = (data: CreateCommentInput) => {
    onSubmit(parentId, { ...data, postId, parentId });
    form.reset({ postId, parentId, authorName: '', authorEmail: '', body: '' });
  };

  return (
    <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
      <h4 className="font-ui text-sm font-semibold text-foreground mb-3">
        Respondendo a {parentAuthorName}
      </h4>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <div>
          <Controller
            control={form.control}
            name="body"
            render={({ field }) => (
              <MarkdownContentField
                id={`reply-body-${parentId}`}
                name="body"
                value={field.value}
                onChange={field.onChange}
                required
                placeholder="Sua resposta… (Markdown: **negrito**, *itálico*, listas…)"
                rows={3}
              />
            )}
          />
          {form.formState.errors.body && (
            <p className="mt-1 font-ui text-xs text-destructive">
              {form.formState.errors.body.message}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending || !canSubmitReply}
            className="font-ui text-sm font-medium px-4 py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Enviando…' : 'Enviar resposta'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="font-ui text-sm text-muted-foreground hover:text-foreground"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
