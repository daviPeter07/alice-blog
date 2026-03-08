'use client';

import Link from 'next/link';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { CreateCommentInput } from '@/lib/schemas/comment.schema';
import type { ActionResult } from '@/lib/types';
import { MarkdownContentField } from '@/components/admin/markdown-content-field';
import { cn } from '@/lib/utils';

export interface CommentFormProps {
  mainForm: UseFormReturn<CreateCommentInput>;
  onSubmit: (data: CreateCommentInput) => void;
  isPending: boolean;
  canSubmit: boolean;
  state: ActionResult | null;
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

export function CommentForm({
  mainForm,
  onSubmit,
  isPending,
  canSubmit,
  state,
  isAuthenticated,
  onLoginClick,
}: CommentFormProps) {
  return (
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
          onClick={onLoginClick}
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

          <form onSubmit={mainForm.handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder={`Escreva aqui suas reflexões. Markdown: **negrito**, *itálico*, listas. HTML: <strong>, <em>, <br>, <a href="url">link</a>.`}
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
                disabled={isPending || !canSubmit || !isAuthenticated}
                className="font-ui text-sm font-medium px-5 py-2.5 rounded-xl bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60"
              >
                {isPending ? 'Enviando…' : 'Enviar comentário'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
