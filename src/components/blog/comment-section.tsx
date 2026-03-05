'use client';

import {
  useActionState,
  useOptimistic,
  startTransition,
  useRef,
  useState,
  forwardRef,
} from 'react';
import { createComment } from '@/actions/comments';
import type { ActionResult, CommentWithReplies } from '@/lib/types';
import { formatDate } from '@/helpers/date';
import { getInitials, avatarHue } from '@/helpers/author';

interface CommentSectionProps {
  postId: string;
  initialComments: CommentWithReplies[];
}

type OptimisticComment = CommentWithReplies & { pending?: boolean };

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const replyFormRef = useRef<HTMLFormElement>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    createComment,
    null
  );

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    OptimisticComment[],
    OptimisticComment
  >(initialComments, (current, next) => [next, ...current]);

  const addOptimistic = (formData: FormData, parentId: string | null) => {
    const authorName = (formData.get('authorName') as string) || 'Você';
    const body = (formData.get('body') as string) || '';
    startTransition(() => {
      addOptimisticComment({
        id: `optimistic-${Date.now()}`,
        postId,
        parentId,
        authorName,
        authorEmail: '',
        approved: false,
        body,
        createdAt: new Date(),
        replies: [],
        pending: true,
      });
    });
  };

  const handleSubmit = (formData: FormData) => {
    const parentId = formData.get('parentId') as string | null;
    addOptimistic(formData, parentId);
    if (parentId) {
      setReplyingToId(null);
      replyFormRef.current?.reset();
    } else {
      formRef.current?.reset();
    }
    formAction(formData);
  };

  const handleReplySubmit = (parentId: string, formData: FormData) => {
    addOptimistic(formData, parentId);
    setReplyingToId(null);
    replyFormRef.current?.reset();
    formAction(formData);
  };

  const topLevel = optimisticComments.filter((c) => !c.parentId);

  return (
    <section className="mt-16 pt-10 border-t border-border">
      {/* Cabeçalho */}
      <h2 className="font-body text-2xl font-semibold text-foreground mb-8">
        {topLevel.length === 0
          ? 'Comentários'
          : `${topLevel.length} comentário${topLevel.length > 1 ? 's' : ''}`}
      </h2>

      {/* Lista de comentários */}
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
            />
          ))}
        </ul>
      )}

      {/* Formulário */}
      <div className="rounded-2xl border border-border bg-card px-7 py-6">
        <h3 className="font-body text-lg font-semibold text-foreground mb-5">
          Deixe um comentário
        </h3>

        {/* Feedback de sucesso */}
        {state?.success === true && (
          <p className="font-ui text-sm text-brand-green mb-4 animate-fade-in">
            Comentário enviado com sucesso! Obrigado pela participação.
          </p>
        )}

        {/* Erro geral */}
        {state?.success === false && !state.fieldErrors && (
          <p className="font-ui text-sm text-destructive mb-4">{state.error}</p>
        )}

        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <input type="hidden" name="postId" value={postId} />

          {/* Nome + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Nome"
              name="authorName"
              placeholder="Seu nome"
              error={state?.success === false ? state.fieldErrors?.authorName?.[0] : undefined}
              required
            />
            <Field
              label="E-mail"
              name="authorEmail"
              type="email"
              placeholder="seu@email.com"
              error={state?.success === false ? state.fieldErrors?.authorEmail?.[0] : undefined}
              required
            />
          </div>

          {/* Corpo */}
          <div>
            <label
              htmlFor="body"
              className="block font-ui text-sm font-medium text-foreground mb-1.5"
            >
              Comentário <span className="text-destructive">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={4}
              placeholder="Escreva aqui suas reflexões…"
              required
              className="
                w-full rounded-lg border border-input bg-background px-4 py-3
                font-ui text-sm text-foreground placeholder:text-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50
                resize-none transition-all duration-150
              "
            />
            {state?.success === false && state.fieldErrors?.body && (
              <p className="mt-1 font-ui text-xs text-destructive">{state.fieldErrors.body[0]}</p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isPending}
              className="
                font-ui text-sm font-medium px-5 py-2.5 rounded-xl
                bg-brand-green text-white
                hover:bg-brand-green/90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60
              "
            >
              {isPending ? 'Enviando…' : 'Enviar comentário'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-componentes                                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  error?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-ui text-sm font-medium text-foreground mb-1.5">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="
          w-full rounded-lg border border-input bg-background px-4 py-2.5
          font-ui text-sm text-foreground placeholder:text-muted-foreground
          focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green/50
          transition-all duration-150
        "
      />
      {error && <p className="mt-1 font-ui text-xs text-destructive">{error}</p>}
    </div>
  );
}

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
}: {
  comment: OptimisticComment;
  allComments: OptimisticComment[];
  postId: string;
  replyingToId: string | null;
  onReplyClick: (id: string | null) => void;
  onReplySubmit: (parentId: string, formData: FormData) => void;
  replyFormRef: React.RefObject<HTMLFormElement | null>;
  isPending: boolean;
  state: ActionResult | null;
}) {
  const replies = allComments.filter((c) => c.parentId === comment.id);
  const hue = avatarHue(comment.authorName);
  const isReplying = replyingToId === comment.id;

  return (
    <li className={`flex gap-4 animate-fade-in ${comment.pending ? 'opacity-50' : ''}`}>
      {/* Avatar */}
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-ui font-semibold select-none mt-0.5"
        style={{ background: `oklch(0.55 0.12 ${hue})` }}
        aria-hidden
      >
        {getInitials(comment.authorName)}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="font-ui text-sm font-semibold text-foreground">
            {comment.authorName}
          </span>
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

        {/* Botão Responder (apenas comentários raiz, não replies) */}
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

        {/* Sub-formulário de reply */}
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

        {/* Replies aninhadas */}
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
    onSubmit: (parentId: string, formData: FormData) => void;
    onCancel: () => void;
    isPending: boolean;
    state: ActionResult | null;
  }
>(function ReplyForm({ postId, parentId, onSubmit, onCancel, isPending, state }, ref) {
  return (
    <div className="mt-4 p-4 rounded-xl border border-border bg-muted/30">
      <h4 className="font-ui text-sm font-semibold text-foreground mb-3">Responder</h4>
      <form
        ref={ref}
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          fd.set('postId', postId);
          fd.set('parentId', parentId);
          onSubmit(parentId, fd);
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Nome"
            name="authorName"
            placeholder="Seu nome"
            error={state?.success === false ? state.fieldErrors?.authorName?.[0] : undefined}
            required
          />
          <Field
            label="E-mail"
            name="authorEmail"
            type="email"
            placeholder="seu@email.com"
            error={state?.success === false ? state.fieldErrors?.authorEmail?.[0] : undefined}
            required
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
            name="body"
            rows={3}
            placeholder="Sua resposta…"
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-green/40 resize-none"
          />
          {state?.success === false && state.fieldErrors?.body && (
            <p className="mt-1 font-ui text-xs text-destructive">{state.fieldErrors.body[0]}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="font-ui text-sm font-medium px-4 py-2 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50"
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
