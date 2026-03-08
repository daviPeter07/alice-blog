'use client';

import { forwardRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, useWatch, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema, type CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult, CommentWithReplies } from '@/lib/types';
import { formatDate, getInitials, avatarHue } from '@/helpers';
import { useCommentSection, useToastOnSuccess, type OptimisticComment } from '@/hooks';
import { AdminCheck } from '@/components/ui/admin-check';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
  isAuthenticated?: boolean;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
}

export function CommentSection({
  postId,
  initialComments,
  isAuthenticated = true,
  currentUser = null,
}: CommentSectionProps) {
  const {
    mainForm,
    state,
    isPending,
    optimisticComments,
    replyingToId,
    setReplyingToId,
    replyFormRef,
    onMainSubmit,
    handleReplySubmit,
  } = useCommentSection({ postId, initialComments, currentUser });

  const authorName = useWatch({ control: mainForm.control, name: 'authorName', defaultValue: '' });
  const authorEmail = useWatch({
    control: mainForm.control,
    name: 'authorEmail',
    defaultValue: '',
  });
  const body = useWatch({ control: mainForm.control, name: 'body', defaultValue: '' });

  const canSubmitMain =
    (isAuthenticated && currentUser
      ? true
      : String(authorName ?? '').trim() !== '' && String(authorEmail ?? '').trim() !== '') &&
    String(body ?? '').trim() !== '';

  useToastOnSuccess(state, 'Comentário enviado com sucesso! Obrigado pela participação.');

  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const topLevel = optimisticComments.filter((c) => !c.parentId);

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-8">
        {topLevel.length === 0
          ? 'Comentários'
          : `${topLevel.length} comentário${topLevel.length > 1 ? 's' : ''}`}
      </h2>

      {topLevel.length > 0 && (
        <ul className="flex flex-col gap-6 mb-10">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={optimisticComments}
              postId={postId}
              replyingToId={replyingToId}
              onReplyClick={setReplyingToId}
              onReplySubmit={handleReplySubmit}
              replyFormRef={replyFormRef}
              isPending={isPending}
              state={state}
              currentUser={currentUser}
            />
          ))}
        </ul>
      )}

      <div
        className={cn(
          'rounded-2xl border border-border bg-card px-7 py-6',
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

            {state?.success === false && !state.fieldErrors && state.error !== 'login_required' && (
              <p className="font-ui text-sm text-destructive mb-4">{state.error}</p>
            )}

            <form onSubmit={mainForm.handleSubmit(onMainSubmit)} className="space-y-4">
              {!currentUser ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <RHFField
                    control={mainForm.control}
                    name="authorName"
                    label="Nome"
                    placeholder="Seu nome"
                    required
                    errorMessage={mainForm.formState.errors.authorName?.message}
                  />
                  <RHFField
                    control={mainForm.control}
                    name="authorEmail"
                    label="E-mail"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    errorMessage={mainForm.formState.errors.authorEmail?.message}
                  />
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="body"
                  className="block font-ui text-sm font-medium text-foreground mb-1.5"
                >
                  Comentário <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="body"
                  rows={4}
                  placeholder="Escreva aqui suas reflexões…"
                  className={cn(
                    'w-full rounded-lg border border-input bg-background px-4 py-3 font-ui text-sm',
                    'text-foreground placeholder:text-muted-foreground resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50',
                    mainForm.formState.errors.body && 'border-destructive'
                  )}
                  {...mainForm.register('body')}
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
/* Campo controlado por React Hook Form                                  */
/* ------------------------------------------------------------------ */

function RHFField<T extends FieldValues>({
  control,
  name,
  label,
  type = 'text',
  placeholder,
  required,
  errorMessage,
}: {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  errorMessage?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-ui text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50 transition-all',
          errorMessage && 'border-destructive'
        )}
        {...control.register(name)}
      />
      {errorMessage && <p className="mt-1 font-ui text-xs text-destructive">{errorMessage}</p>}
    </div>
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
  replyFormRef,
  isPending,
  state,
  currentUser,
}: {
  comment: OptimisticComment;
  allComments: OptimisticComment[];
  postId: string;
  replyingToId: string | null;
  onReplyClick: (id: string | null) => void;
  onReplySubmit: (parentId: string, data: CreateCommentInput) => void;
  replyFormRef: React.RefObject<HTMLFormElement | null>;
  isPending: boolean;
  state: ActionResult | null;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
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

        <p className="font-ui text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>

        {!comment.parentId && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => onReplyClick(isReplying ? null : comment.id)}
              className="font-ui text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {isReplying ? 'Cancelar' : 'Responder'}
            </button>
          </div>
        )}

        {isReplying && (
          <ReplyForm
            ref={replyFormRef}
            postId={postId}
            parentId={comment.id}
            onSubmit={onReplySubmit}
            onCancel={() => onReplyClick(null)}
            isPending={isPending}
            state={state}
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
                replyFormRef={replyFormRef}
                isPending={isPending}
                state={state}
                currentUser={currentUser}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

const ReplyForm = forwardRef<
  HTMLFormElement,
  {
    postId: string;
    parentId: string;
    onSubmit: (parentId: string, data: CreateCommentInput) => void;
    onCancel: () => void;
    isPending: boolean;
    state: ActionResult | null;
  }
>(function ReplyForm({ postId, parentId, onSubmit, onCancel, isPending, state }, ref) {
  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    mode: 'onChange',
    defaultValues: {
      postId,
      parentId,
      authorName: '',
      authorEmail: '',
      body: '',
    },
  });

  const replyAuthorName = useWatch({ control: form.control, name: 'authorName', defaultValue: '' });
  const replyAuthorEmail = useWatch({
    control: form.control,
    name: 'authorEmail',
    defaultValue: '',
  });
  const replyBody = useWatch({ control: form.control, name: 'body', defaultValue: '' });
  const canSubmitReply =
    String(replyAuthorName ?? '').trim() !== '' &&
    String(replyAuthorEmail ?? '').trim() !== '' &&
    String(replyBody ?? '').trim() !== '';

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
      <h4 className="font-ui text-sm font-semibold text-foreground mb-3">Responder</h4>
      <form ref={ref} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RHFField
            control={form.control}
            name="authorName"
            label="Nome"
            placeholder="Seu nome"
            required
            errorMessage={form.formState.errors.authorName?.message}
          />
          <RHFField
            control={form.control}
            name="authorEmail"
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            required
            errorMessage={form.formState.errors.authorEmail?.message}
          />
        </div>
        <div>
          <label
            htmlFor={`reply-body-${parentId}`}
            className="block font-ui text-sm font-medium text-foreground mb-1"
          >
            Resposta <span className="text-destructive">*</span>
          </label>
          <textarea
            id={`reply-body-${parentId}`}
            rows={3}
            placeholder="Sua resposta…"
            className={cn(
              'w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40 resize-none',
              form.formState.errors.body && 'border-destructive'
            )}
            {...form.register('body')}
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
});
