'use client';

import { BadgeCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminCheckProps {
  className?: string;
  size?: number;
  title?: string;
}

/**
 * Ícone de verificação exibido ao lado do nome de usuários com role ADMIN
 * (em posts e comentários).
 */
export function AdminCheck({ className, size = 14, title = 'Administrador' }: AdminCheckProps) {
  return (
    <BadgeCheck
      size={size}
      aria-label={title}
      className={cn('shrink-0 text-brand-green', className)}
    />
  );
}
