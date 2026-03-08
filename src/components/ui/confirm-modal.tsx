'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmModalVariant = 'confirm' | 'delete' | 'login';

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: ConfirmModalVariant;
  title: string;
  message?: string;
  /** For variant=login: redirects to /auth/login on confirm if not provided */
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

const defaultLabels: Record<ConfirmModalVariant, { confirm: string; cancel: string }> = {
  confirm: { confirm: 'Confirmar', cancel: 'Cancelar' },
  delete: { confirm: 'Excluir', cancel: 'Cancelar' },
  login: { confirm: 'Entrar', cancel: 'Fechar' },
};

export function ConfirmModal({
  open,
  onOpenChange,
  variant,
  title,
  message,
  onConfirm,
  confirmLabel,
  cancelLabel,
}: ConfirmModalProps) {
  const router = useRouter();
  const defaults = defaultLabels[variant];

  const handleConfirm = () => {
    if (variant === 'login') {
      onOpenChange(false);
      if (onConfirm) {
        onConfirm();
      } else {
        router.push('/auth/login');
      }
    } else {
      onConfirm?.();
      onOpenChange(false);
    }
  };

  const isDestructive = variant === 'delete';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4',
            'border bg-background p-6 shadow-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'duration-200'
          )}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={() => onOpenChange(false)}
        >
          <Dialog.Title className="font-body text-lg font-semibold text-foreground">
            {title}
          </Dialog.Title>
          {message && (
            <Dialog.Description className="font-ui text-sm text-muted-foreground">
              {message}
            </Dialog.Description>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Dialog.Close asChild>
              <Button variant="outline" size="sm">
                {cancelLabel ?? defaults.cancel}
              </Button>
            </Dialog.Close>
            <Button
              variant={isDestructive ? 'destructive' : 'default'}
              size="sm"
              onClick={handleConfirm}
            >
              {confirmLabel ?? defaults.confirm}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
