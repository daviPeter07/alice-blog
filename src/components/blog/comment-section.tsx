"use client";

import { useActionState, useOptimistic, startTransition, useRef } from "react";
import { createComment } from "@/actions/comments";
import type { ActionResult, CommentWithReplies } from "@/lib/types";

interface CommentSectionProps {
  postId:          string;
  initialComments: CommentWithReplies[];
}

type OptimisticComment = CommentWithReplies & { pending?: boolean };

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("pt-BR", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  }).format(date);

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const avatarHue = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
};

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<
    ActionResult | null,
    FormData
  >(createComment, null);

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    OptimisticComment[],
    OptimisticComment
  >(initialComments, (current, next) => [next, ...current]);

  const handleSubmit = (formData: FormData) => {
    const authorName = (formData.get("authorName") as string) || "Você";
    const body       = (formData.get("body") as string) || "";

    startTransition(() => {
      addOptimisticComment({
        id:          `optimistic-${Date.now()}`,
        postId,
        parentId:    null,
        authorName,
        authorEmail: "",
        approved:    false,
        body,
        createdAt:   new Date(),
        replies:     [],
        pending:     true,
      });
    });

    formRef.current?.reset();
    formAction(formData);
  };

  const topLevel = optimisticComments.filter((c) => !c.parentId);

  return (
    <section className="mt-16 pt-10 border-t border-border">
      {/* Cabeçalho */}
      <h2 className="font-body text-2xl font-semibold text-foreground mb-8">
        {topLevel.length === 0
          ? "Comentários"
          : `${topLevel.length} comentário${topLevel.length > 1 ? "s" : ""}`}
      </h2>

      {/* Lista de comentários */}
      {topLevel.length > 0 && (
        <ul className="flex flex-col gap-6 mb-10">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              allComments={optimisticComments}
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
          <p className="font-ui text-sm text-destructive mb-4">
            {state.error}
          </p>
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
              <p className="mt-1 font-ui text-xs text-destructive">
                {state.fieldErrors.body[0]}
              </p>
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
              {isPending ? "Enviando…" : "Enviar comentário"}
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
  type = "text",
  placeholder,
  error,
  required,
}: {
  label:       string;
  name:        string;
  type?:       string;
  placeholder: string;
  error?:      string;
  required?:   boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-ui text-sm font-medium text-foreground mb-1.5"
      >
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
      {error && (
        <p className="mt-1 font-ui text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  allComments,
}: {
  comment:     OptimisticComment;
  allComments: OptimisticComment[];
}) {
  const replies = allComments.filter((c) => c.parentId === comment.id);
  const hue     = avatarHue(comment.authorName);

  return (
    <li
      className={`flex gap-4 animate-fade-in ${comment.pending ? "opacity-50" : ""}`}
    >
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
            <span className="font-ui text-xs text-muted-foreground italic">
              enviando…
            </span>
          )}
        </div>

        <p className="font-ui text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>

        {/* Replies aninhadas */}
        {replies.length > 0 && (
          <ul className="mt-4 pl-4 border-l border-border flex flex-col gap-4">
            {replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
