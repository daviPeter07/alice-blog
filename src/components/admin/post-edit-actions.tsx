'use client';

import { useState, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/confirm-modal';

export interface PostEditActionsPost {
  id: string;
  status: string;
}

export interface PostEditActionsProps {
  post: PostEditActionsPost;
  publishAction: (formData: FormData) => void;
  unpublishAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  isPublishPending: boolean;
  isUnpublishPending: boolean;
  isDeletePending: boolean;
  isPending: boolean;
}

export function PostEditActions({
  post,
  publishAction,
  unpublishAction,
  deleteAction,
  isPublishPending,
  isUnpublishPending,
  isDeletePending,
  isPending,
}: PostEditActionsProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleConfirmDelete = () => {
    const fd = new FormData();
    fd.set('id', post.id);
    startTransition(() => deleteAction(fd));
  };

  return (
    <div className="pt-6 border-t border-border flex flex-wrap gap-3">
      {post.status === 'DRAFT' ? (
        <form action={publishAction} className="inline-block">
          <input type="hidden" name="id" value={post.id} />
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-brand-green text-white shadow-md hover:bg-brand-green/90 hover:shadow-lg transition-all px-5 py-2.5 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPublishPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </form>
      ) : (
        <form action={unpublishAction} className="inline-block">
          <input type="hidden" name="id" value={post.id} />
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer border-2 border-border bg-muted/60 text-muted-foreground shadow-md hover:bg-muted hover:border-muted-foreground/30 hover:shadow-lg transition-all px-5 py-2.5 rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUnpublishPending ? 'Despublicando…' : 'Despublicar'}
          </Button>
        </form>
      )}
      <Button
        type="button"
        disabled={isPending}
        variant="outline"
        className="cursor-pointer text-destructive border-destructive hover:bg-destructive/10 disabled:cursor-not-allowed"
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
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
