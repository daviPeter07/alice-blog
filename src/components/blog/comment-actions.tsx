'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { deleteComment, updateComment } from '@/actions/comments';
import { ConfirmModal } from '@/components/ui/confirm-modal';
import { MarkdownContentField } from '@/components/admin/markdown-content-field';
import { cn } from '@/lib/utils';

const EDIT_WINDOW_MS = 5 * 60 * 1000;
const EDIT_WINDOW_MINUTES = 5;

const editCommentSchema = z.object({
  body: z.string().min(3, 'Mínimo 3 caracteres.').max(5000, 'Máximo 5.000 caracteres.'),
});

type EditCommentForm = z.infer<typeof editCommentSchema>;

export interface CommentActionsProps {
  commentId: string;
  postId: string;
  body: string;
  authorEmail: string;
  createdAt: Date | string;
  currentUserEmail: string | undefined;
  onDeleted: () => void;
  onUpdated: () => void;
}

export function CommentActions({
  commentId,
  postId,
  body,
  authorEmail,
  createdAt,
  currentUserEmail,
  onDeleted,
  onUpdated,
}: CommentActionsProps) {
  const isOwn = currentUserEmail === authorEmail;
  const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const canEdit = isOwn && Date.now() - createdAtDate.getTime() < EDIT_WINDOW_MS;

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const form = useForm<EditCommentForm>({
    resolver: zodResolver(editCommentSchema),
    defaultValues: { body },
  });

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleDeleteConfirm = () => {
    deleteComment(null, { commentId, postId }).then((r) => {
      if (r?.success) {
        toast.success('Comentário excluído.');
        onDeleted();
      } else {
        toast.error(r?.error ?? 'Erro ao excluir.');
      }
    });
  };

  const handleSaveEdit = form.handleSubmit((data) => {
    updateComment(null, { commentId, postId, body: data.body }).then((r) => {
      if (r?.success) {
        toast.success('Comentário atualizado.');
        setEditing(false);
        onUpdated();
      } else {
        toast.error(r?.error ?? 'Erro ao salvar.');
      }
    });
  });

  const openEdit = () => {
    setMenuOpen(false);
    if (canEdit) setEditing(true);
  };

  const openDelete = () => {
    setMenuOpen(false);
    setDeleteModalOpen(true);
  };

  if (!isOwn) return null;

  return (
    <div ref={menuRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
        aria-label="Opções do comentário"
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {menuOpen && (
        <div
          className="absolute bottom-full left-0 mb-1 min-w-[200px] rounded-lg border border-border bg-card py-1 shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-150"
          role="menu"
        >
          <div className="px-3 py-2">
            <button
              type="button"
              role="menuitem"
              onClick={openEdit}
              disabled={!canEdit}
              className={cn(
                'w-full flex items-center gap-2 font-ui text-sm text-left transition-colors rounded py-1 -mx-1 px-1',
                canEdit
                  ? 'text-foreground hover:bg-muted/80'
                  : 'text-muted-foreground opacity-50 cursor-not-allowed'
              )}
            >
              <Pencil className="size-3.5 shrink-0" />
              Editar
            </button>
            {!canEdit && (
              <p className="text-[10px] text-muted-foreground/80 mt-0.5 pl-5">
                Só é possível editar até {EDIT_WINDOW_MINUTES} min após publicar.
              </p>
            )}
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={openDelete}
            className="w-full flex items-center gap-2 px-3 py-2 font-ui text-sm text-left text-foreground hover:bg-muted/80 hover:text-destructive transition-colors"
          >
            <Trash2 className="size-3.5 shrink-0" />
            Excluir
          </button>
        </div>
      )}

      {editing && (
        <div className="mt-3 p-3 rounded-xl border border-border bg-muted/30">
          <p className="font-ui text-xs font-medium text-foreground mb-2">Editar comentário</p>
          <form onSubmit={handleSaveEdit} className="space-y-2">
            <Controller
              control={form.control}
              name="body"
              render={({ field }) => (
                <MarkdownContentField
                  id={`edit-body-${commentId}`}
                  name="body"
                  value={field.value}
                  onChange={field.onChange}
                  required
                  placeholder="Seu comentário…"
                  rows={3}
                />
              )}
            />
            {form.formState.errors.body && (
              <p className="font-ui text-xs text-destructive">
                {form.formState.errors.body.message}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="font-ui text-sm font-medium px-3 py-1.5 rounded-lg bg-brand-green text-white hover:bg-brand-green/90 disabled:opacity-50"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="font-ui text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        variant="delete"
        title="Excluir comentário?"
        message="Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        confirmLabel="Excluir"
      />
    </div>
  );
}
