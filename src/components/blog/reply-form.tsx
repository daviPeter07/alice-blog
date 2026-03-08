'use client';

import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema, type CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult } from '@/lib/types';
import { MarkdownContentField } from '@/components/admin/markdown-content-field';

export interface ReplyFormProps {
  postId: string;
  parentId: string;
  parentAuthorName: string;
  onSubmit: (parentId: string, data: CreateCommentInput) => void;
  onCancel: () => void;
  isPending: boolean;
  state: ActionResult | null;
  currentUser?: { name: string; email: string; role?: 'ADMIN' | 'READER' } | null;
}

export function ReplyForm({
  postId,
  parentId,
  parentAuthorName,
  onSubmit,
  onCancel,
  isPending,
  state,
  currentUser,
}: ReplyFormProps) {
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
    form.reset({
      postId,
      parentId,
      authorName: currentUser?.name ?? '',
      authorEmail: currentUser?.email ?? '',
      body: '',
    });
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
                placeholder={`Sua resposta. Markdown: **negrito**, *itálico*, listas. HTML: <strong>, <em>, <br>, <a href="url">link</a>.`}
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
