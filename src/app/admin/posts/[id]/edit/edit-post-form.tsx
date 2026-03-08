'use client';

import { useState, useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updatePost, deletePost, publishPost, unpublishPost } from '@/actions/posts';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';

interface EditPostFormProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    tags: string[];
    status: string;
  };
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateState, updateAction, isUpdatePending] = useActionState(updatePost, null);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deletePost, null);
  const [publishState, publishAction, isPublishPending] = useActionState(publishPost, null);
  const [unpublishState, unpublishAction, isUnpublishPending] = useActionState(unpublishPost, null);

  useEffect(() => {
    if (updateState?.success) {
      router.refresh();
    }
  }, [updateState?.success, router]);

  useEffect(() => {
    if (deleteState?.success) {
      router.push('/admin/posts');
      router.refresh();
    }
  }, [deleteState?.success, router]);

  useEffect(() => {
    if (publishState?.success || unpublishState?.success) {
      router.refresh();
    }
  }, [publishState?.success, unpublishState?.success, router]);

  const isPending = isUpdatePending || isDeletePending || isPublishPending || isUnpublishPending;

  return (
    <div className="space-y-8">
      {(updateState?.success === false ||
        deleteState?.success === false ||
        publishState?.success === false ||
        unpublishState?.success === false) && (
        <p className="font-ui text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-2">
          {updateState && !updateState.success && 'error' in updateState
            ? updateState.error
            : deleteState && !deleteState.success && 'error' in deleteState
              ? deleteState.error
              : publishState && !publishState.success && 'error' in publishState
                ? publishState.error
                : unpublishState && !unpublishState.success && 'error' in unpublishState
                  ? unpublishState.error
                  : 'Erro.'}
        </p>
      )}

      <form action={updateAction} className="space-y-6">
        <input type="hidden" name="id" value={post.id} />
        <div>
          <label
            htmlFor="title"
            className="block font-ui text-sm font-medium text-foreground mb-1.5"
          >
            Título
          </label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={post.title}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground"
          />
        </div>
        <div>
          <label
            htmlFor="slug"
            className="block font-ui text-sm font-medium text-foreground mb-1.5"
          >
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post.slug}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground"
          />
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
            defaultValue={post.excerpt}
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
            defaultValue={post.content}
            required
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground resize-y"
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block font-ui text-sm font-medium text-foreground mb-1.5"
          >
            Tags (separadas por vírgula)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={Array.isArray(post.tags) ? post.tags.join(', ') : ''}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 font-ui text-sm text-foreground"
          />
        </div>
        <input type="hidden" name="status" value={post.status} />
        <Button
          type="submit"
          disabled={isPending}
          className="bg-brand-green hover:bg-brand-green/90"
        >
          {isUpdatePending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </form>

      <div className="pt-6 border-t border-border flex flex-wrap gap-3">
        {post.status === 'DRAFT' ? (
          <form action={publishAction}>
            <input type="hidden" name="id" value={post.id} />
            <Button type="submit" disabled={isPending} variant="secondary">
              {isPublishPending ? 'Publicando…' : 'Publicar'}
            </Button>
          </form>
        ) : (
          <form action={unpublishAction}>
            <input type="hidden" name="id" value={post.id} />
            <Button type="submit" disabled={isPending} variant="secondary">
              {isUnpublishPending ? 'Despublicando…' : 'Despublicar'}
            </Button>
          </form>
        )}
        <Button
          type="button"
          disabled={isPending}
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/10"
          onClick={() => setDeleteModalOpen(true)}
        >
          {isDeletePending ? 'Removendo…' : 'Remover post'}
        </Button>
        <ConfirmModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          variant="delete"
          title="Remover post"
          message="Esta ação não pode ser desfeita. Tem certeza?"
          confirmLabel="Excluir"
          onConfirm={() => {
            const fd = new FormData();
            fd.set('id', post.id);
            deleteAction(fd);
          }}
        />
        <Link
          href="/admin/posts"
          className="font-ui text-sm text-muted-foreground hover:text-foreground px-4 py-2"
        >
          Cancelar
        </Link>
      </div>
    </div>
  );
}
