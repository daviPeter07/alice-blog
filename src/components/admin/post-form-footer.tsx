'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export interface PostFormFooterProps {
  isEdit: boolean;
  isPending: boolean;
  submitDisabled: boolean;
}

export function PostFormFooter({ isEdit, isPending, submitDisabled }: PostFormFooterProps) {
  return (
    <div className="flex gap-3 pt-2">
      <Button
        type="submit"
        disabled={submitDisabled}
        className="bg-brand-green hover:bg-brand-green/90"
      >
        {isPending ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Criar rascunho'}
      </Button>
      <Link
        href="/admin/posts"
        className="font-ui text-sm text-muted-foreground hover:text-foreground px-4 py-2"
      >
        Cancelar
      </Link>
    </div>
  );
}
