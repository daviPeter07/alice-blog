'use client';

import { useActionState, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createPost } from '@/actions/posts';
import { Button } from '@/components/ui/button';
import { slugFromTitle } from '@/helpers';

export function NewPostForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createPost, null);
  const [title, setTitle] = useState('');

  const slug = useMemo(() => slugFromTitle(title), [title]);

  useEffect(() => {
    if (state && state.success === true && 'data' in state && state.data) {
      router.push(`/admin/posts/${state.data.id}/edit`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.success === false && (
        <p className="font-ui text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-2">
          {state.error}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block font-ui text-sm font-medium text-foreground mb-1.5">
          Título
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground"
        />
      </div>

      <div>
        <label htmlFor="slug" className="block font-ui text-sm font-medium text-foreground mb-1.5">
          Slug (URL)
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          readOnly
          value={slug}
          tabIndex={-1}
          aria-describedby="slug-hint"
          className="w-full rounded-lg border border-input bg-muted/50 px-4 py-2.5 font-ui text-sm text-muted-foreground cursor-default"
        />
        <p id="slug-hint" className="mt-1 font-ui text-xs text-muted-foreground">
          Gerado automaticamente a partir do título.
        </p>
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block font-ui text-sm font-medium text-foreground mb-1.5"
        >
          Resumo
        </label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground resize-none"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="block font-ui text-sm font-medium text-foreground mb-1.5"
        >
          Conteúdo
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          required
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground resize-y"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block font-ui text-sm font-medium text-foreground mb-1.5">
          Tags (separadas por vírgula)
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="filosofia, reflexão"
          className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground"
        />
      </div>

      <input type="hidden" name="status" value="DRAFT" />

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          disabled={isPending || !slug.trim()}
          className="bg-brand-green hover:bg-brand-green/90"
        >
          {isPending ? 'Salvando…' : 'Criar rascunho'}
        </Button>
        <Link
          href="/admin/posts"
          className="font-ui text-sm text-muted-foreground hover:text-foreground px-4 py-2"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
