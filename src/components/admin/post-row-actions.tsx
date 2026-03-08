'use client';

import { useState, useActionState, useEffect, startTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deletePost } from '@/actions/posts';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { cn } from '@/lib/utils';

export interface PostRowActionsProps {
  postId: string;
  postTitle: string;
}

export function PostRowActions({ postId, postTitle }: PostRowActionsProps) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteState, deleteAction, isDeletePending] = useActionState(deletePost, null);

  useEffect(() => {
    if (deleteState?.success) {
      router.push('/admin/posts');
      router.refresh();
    }
  }, [deleteState?.success, router]);

  const handleConfirmDelete = () => {
    const fd = new FormData();
    fd.set('id', postId);
    startTransition(() => {
      deleteAction(fd);
    });
    toast.success('Post excluído com sucesso.');
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Link
        href={`/admin/posts/${postId}/edit`}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
        aria-label="Editar post"
      >
        <Pencil className="size-4" strokeWidth={2} />
      </Link>
      <button
        type="button"
        onClick={() => setDeleteModalOpen(true)}
        disabled={isDeletePending}
        className={cn(
          'p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Excluir post"
      >
        <Trash2 className="size-4" strokeWidth={2} />
      </button>
      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        variant="delete"
        title="Excluir post"
        message={`Tem certeza que deseja excluir "${postTitle}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
